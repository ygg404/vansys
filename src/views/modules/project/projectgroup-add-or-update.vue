<template>
  <div>
    <van-dialog
      v-model="visible"
      show-cancel-button
      style="height:520px;"
      @confirm="dataFormSubmit"
    >
      <template slot="title">
        <div style="font-size:18px;font-weight:600;">选择作业组</div>
      </template>
      <div style="margin-bottom:5px;margin-top:5px; ">
        <span style="color: #1989fa;font-size:15px;margin-left:10px;">预计产值：{{this.totalOutPut}}</span>
      </div>
      <van-row style="margin-bottom:2px;">
        <van-col span="6" style="text-align:center;">占比(%)</van-col>
        <van-col span="6" style="text-align:center;">产值</van-col>
        <van-col span="6" style="text-align:center;">最短工期</van-col>
        <van-col span="6" style="text-align:center;">最长工期</van-col>
      </van-row>
      <div style="overflow:scroll; width:100%; height:320px;">
        <van-list class="projectgroupliststyle" :key="index" v-for="(item,index) in groupList">
          <van-row style="height:50px;margin-bottom:4px;">
            <van-col span="24">
              <van-row>
                <van-col span="12" style="text-align:center;">
                  <div style="padding-left:10px;">
                    <van-checkbox
                      v-model="item.checked"
                      size="large"
                      @change="headMenListEvent"
                      shape="square"
                      class="width:50%;"
                    >{{item.groupName}}</van-checkbox>
                  </div>
                </van-col>
                <van-col span="12" style="text-align:center;">{{item.headMan}}</van-col>
              </van-row>
              <van-row>
                <div style="width:100%;height:25px; display:flex;align-items:center;">
                  <div style="width:25%;float:left;">
                    <div
                      style="margin-left:10%;width:80%;"
                      :class=" item.checked == true ? 'numinputstyle' : 'disabledstyle'"
                    >
                      <van-field
                        v-model="item.outputRate"
                        @change="addRate(item)"
                        type="number"
                        :disabled="!item.checked"
                      />
                    </div>
                  </div>
                  <div style="width:25%;float:left;">
                    <div
                      style="margin-left:10%;width:80%;"
                      :class=" item.checked == true ? 'numinputstyle' : 'disabledstyle'"
                    >
                      <van-field
                        v-model="item.projectOutput"
                        @change="addOutPut(item)"
                        type="number"
                        :disabled="!item.checked"
                      />
                    </div>
                  </div>
                  <div style="width:25%;float:left;">
                    <div
                      style="margin-left:10%;width:80%;"
                      :class=" item.checked == true ? 'numinputstyle' : 'disabledstyle'"
                    >
                      <van-field
                        v-model="item.shortDateTime"
                        type="number"
                        :disabled="!item.checked"
                      />
                    </div>
                  </div>
                  <div style="width:25%;float:left;">
                    <div
                      style="margin-left:10%;width:80%;"
                      :class=" item.checked == true ? 'numinputstyle' : 'disabledstyle'"
                    >
                      <van-field
                        v-model="item.lastDateTime"
                        type="number"
                        :disabled="!item.checked"
                      />
                    </div>
                  </div>
                </div>
              </van-row>
            </van-col>
          </van-row>
        </van-list>
      </div>
      <div style="color: #1989fa;font-size:15px;margin-left:10px;">
        合计：
        <span
          :class="(totalOutPut > tOutPut+1 || totalOutPut < tOutPut -1)? 'span_error':'span_ok'"
        >产值{{tOutPut}}</span>,
        <span :class="(tRate > 100.01 || tRate < 99.99)? 'span_error':'span_ok'">占比{{tRate}}%</span>
      </div>
      <van-cell-group class="hns">
        <van-cell title="项目负责人" :value="headname" @click="esVisible = true" v-if="headname != ''" />
        <van-cell title="请选择项目负责人" @click="esVisible = true" v-else />
      </van-cell-group>
    </van-dialog>

    <van-popup v-model="esVisible" position="bottom">
      <van-picker
        show-toolbar
        title="选择项目负责人"
        value-key="username"
        :columns="headManList"
        @cancel="esVisible = false"
        @confirm="onProjectLeaderConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      loading: true,
      esVisible: false,
      totalOutPut: 0,
      tOutPut: 0, // 计算中的产值和占比
      tRate: 0,
      projectNo: '',
      headname: '',
      dataForm: {
        id: 0,
        projectNo: '',
        groupId: '',
        outputRate: '',
        shortDateTime: '',
        lastDateTime: '',
        projectOutput: '',
        projectActuallyOutput: ''
      },
      groupList: [],
      projectworkList: [],
      headManList: [], // 项目负责人列表
      headId: ''
    }
  },
  methods: {
    onProjectLeaderConfirm (item) {
      this.headId = item.userId
      this.headname = item.username
      this.esVisible = false
    },
    init (projectNo, totalOutPut = 0) {
      this.projectNo = projectNo
      this.totalOutPut = totalOutPut
      this.getProjectWorkList(projectNo).then(grouplist => {
        this.groupList = grouplist
        this.loading = false
        this.getProjectChargeList().then(data => {
          this.headManList = data
          this.headMenListEvent()
        })
        // 获取项目负责人列表
        this.getProjectCharge(projectNo).then(projectPlan => {
          for (let headman of this.headManList) {
            if (headman.username === projectPlan.projectCharge) {
              this.headId = headman.userId
              this.headname = headman.username
              console.log('headid' + this.headId)
            }
          }
        })
      })
      this.visible = true
    },
    // 表单提交
    dataFormSubmit () {
      if (this.tRate > 100.01 || this.tRate < 99.99) {
        this.$notify({
          type: 'danger',
          message: '总百分比不能超过100或者小于100'
        })
        return
      } else if (
        this.totalOutPut > this.tOutPut + 1 ||
        this.totalOutPut < this.tOutPut - 1
      ) {
        this.$notify({
          type: 'danger',
          message: '总计产值不能超过或者小于总预计产值'
        })
        return
      }

      this.$http({
        url: this.$http.adornUrl(`/project/group/saveList`),
        method: 'post',
        data: this.$http.adornData({
          pgroupList: this.groupList,
          projectNo: this.projectNo,
          headId: this.headId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
          this.visible = false
          this.$emit('refreshDataList')
        } else {
          this.$message({
            message: data.msg,
            type: 'danger',
            duration: 1500
          })
        }
      })
    },
    // 作业队长列表
    headMenListEvent () {
      // this.headManList = []
      for (let group of this.groupList) {
        if (group.checked) {
          this.headId = group.headId
        }
      }
      this.getSum()
    },
    addRate (item) {
      console.log(item)
      item.projectOutput = parseFloat(
        (item.outputRate * this.totalOutPut) / 100
      ).toFixed(2)
      var shortNum =
        (item.projectOutput * 0.7) / 2400 -
        parseInt((item.projectOutput * 0.7) / 2400)

      if (shortNum === 0) {
        item.shortDateTime = Math.round((item.projectOutput * 0.7) / 2400)
      } else if (shortNum < 0.5) {
        item.shortDateTime = parseInt((item.projectOutput * 0.7) / 2400) + 0.5
      } else {
        item.shortDateTime = Math.round((item.projectOutput * 0.7) / 2400)
      }

      var lastNum =
        (item.projectOutput * 1.3) / 2400 -
        parseInt((item.projectOutput * 1.3) / 2400)
      if (lastNum === 0) {
        item.lastDateTime = Math.round((item.projectOutput * 1.3) / 2400)
      }
      if (lastNum < 0.5) {
        item.lastDateTime = parseInt((item.projectOutput * 1.3) / 2400) + 0.5
      } else {
        item.lastDateTime = Math.round((item.projectOutput * 1.3) / 2400)
      }
      item.projectOutput = parseFloat(item.projectOutput)
      this.getSum()
    },
    addOutPut (item) {
      // console.log(this.project_output)
      item.outputRate = parseFloat(
        (item.projectOutput * 100) / this.totalOutPut
      ).toFixed(2)
      var shortNum = Math.round(
        (item.projectOutput * 0.7) / 2400 -
          parseInt((item.projectOutput * 0.7) / 2400)
      )
      console.log('short:' + shortNum)
      if (shortNum > 0 < 0.5) {
        item.shortDateTime = parseInt((item.projectOutput * 0.7) / 2400) + 0.5
      } else {
        item.shortDateTime = Math.round((item.projectOutput * 0.7) / 2400)
      }
      var lastNum = Math.round(
        (item.projectOutput * 1.3) / 2400 -
          parseInt((item.projectOutput * 1.3) / 2400)
      )
      console.log('lastNum:' + lastNum)
      if (lastNum > 0 < 0.5) {
        item.lastDateTime = parseInt((item.projectOutput / 2400) * 1.3) + 0.5
      } else {
        item.lastDateTime = Math.round((item.projectOutput / 2400) * 1.3)
      }
      item.outputRate = parseFloat(item.outputRate)
      this.getSum()
    },
    // 运算总和
    getSum () {
      this.tRate = 0
      this.tOutPut = 0
      for (let group of this.groupList) {
        if (group.checked) {
          this.tOutPut += parseFloat(group.projectOutput)
          this.tRate += Math.round(group.outputRate, 2)
        }
      }
      this.tOutPut = parseFloat(this.tOutPut.toFixed(2))
    },
    // 获取项目负责人列表
    getProjectChargeList () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/project/group/getChargeList`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            resolve(data.list)
          } else {
            this.$message.error(data.msg)
            reject(data.msg)
          }
        })
      })
    },
    // 获取项目负责人
    getProjectCharge (projectNo) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/project/plan/info/${projectNo}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            resolve(data.projectPlan)
          } else {
            this.$message.error(data.msg)
            reject(data.msg)
          }
        })
      })
    },
    // 获取作业分组数据
    getProjectWorkList (projectNo) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(
            `/project/group/getListByProjectNo/${projectNo}`
          ),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            resolve(data.list)
          } else {
            this.$message.error(data.msg)
            reject(data.msg)
          }
        })
      })
    }
  }
}
</script>

     <style>
.numinputstyle .van-field__control {
  border: 1px solid #cfcfcc;
}
.numinputstyle .van-cell {
  padding: 0px;
}
.disabledstyle .van-field__control {
  border: 1px solid #cfcfcc;
  background-color: #cfcfcc21;
}
.disabledstyle .van-cell {
  padding: 0px;
}
.hns .van-cell{
font-size:16px;
}

</style>
