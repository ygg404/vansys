<template>
  <van-dialog  v-model="visible" width="95%"
              @confirm="dataFormSubmit"  @cancel="visible = false" showCancelButton="true"
               confirmButtonText="确定" cancelButtonText="返回">
    <template solt="title">
      <div style="padding-top:5px;text-align:center;font-size:16px;">
        <strong>{{title}}</strong>
      </div>
    </template>
    <van-row>
      <van-col span="12">
        <van-row>参评人员</van-row>
        <van-row type="flex"  style="padding-top:5px;padding-bottom:5px;">
          <van-col span="10" class="tac"><el-checkbox v-model="allCheck" @change="allCheckHandle"></el-checkbox>是否参评</van-col>
          <van-col span="8" class="tac">姓名</van-col>
        </van-row>
        <div style="max-height:400px;overflow:auto;">
          <van-row v-for="item in kbiCheckList" :key="item.userId" type="flex"  style="padding-bottom:5px;">
            <van-col span="10" class="tac"><el-checkbox v-model="item.isAttend"></el-checkbox></van-col>
            <van-col span="8" class="tac">{{item.username}}</van-col>
          </van-row>
        </div>
      </van-col>

      <van-col span="12">
        <van-row>被参评人员</van-row>
          <van-row type="flex"  style="padding-top:5px;padding-bottom:5px;">
          <van-col span="10" class="tac"><el-checkbox v-model="allChecked" @change="allCheckedHandle"></el-checkbox>是否参评</van-col>
          <van-col span="8" class="tac">姓名</van-col>
          </van-row>
          <div style="max-height:400px;overflow:auto;">
          <van-row v-for="item in kbiPersonList" :key="item.userId" type="flex"  style="padding-bottom:5px;">
          <van-col span="10" class="tac"><el-checkbox v-model="item.isAttend"></el-checkbox></van-col>
          <van-col span="8" class="tac">{{item.username}}</van-col>
          </van-row>
          </div>
      </van-col>
    </van-row>

  </van-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        title: '',
        year: '',
        month: '',
        allChecked: false,
        allCheck: false,
        dataListSelections: [],
        kbiPersonList: [],  // 被考核人员列表
        kbiCheckList: []   // 考核人员列表
      }
    },
    methods: {
      init (item) {
        this.visible = true
        // 考核和被考核人员 默认是 非全选
        this.allChecked = false
        this.allCheck = false
        this.$nextTick( () => {
          this.year = item.checkYear
          this.month = item.checkMonth
          this.title = '设置 ： ' + item.checkYear + '年' + (item.checkMonth) + '月   的参评人员'
          this.getKbiPersonList().then(list => {
            for (let dat of list) {
              if (dat.isAttend === 1) {
                dat.isAttend = true
              } else {
                dat.isAttend = false
              }
            }
            this.kbiPersonList = list
          })
          this.getKbiCheckList().then(list => {
            for (let dat of list) {
              if (dat.isAttend === 1) {
                dat.isAttend = true
              } else {
                dat.isAttend = false
              }
            }
            this.kbiCheckList = list
          })
        })
      },
      // 被考核人员
      getKbiPersonList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbiperson/list`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.year,
              month: this.month
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 考核人员
      getKbiCheckList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbicheck/list`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.year,
              month: this.month
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      dataFormSubmit () {
        this.postPersonListToApi().then(success => {
          this.postCheckListToApi().then(success => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
            this.$emit('refreshDataList')
          })
        })
      },
      // 提交考核人员
      postCheckListToApi () {
        return new Promise((resolve, reject) => {
          let kbiCheckList = []
          for (let item of this.kbiCheckList) {
            if (item.isAttend) {
              let personItem = {
                userId: item.userId,
                year: this.year,
                month: this.month
              }
              kbiCheckList.push(personItem)
            }
          }
          this.$http({
            url: this.$http.adornUrl(`/ren/kbicheck/save`),
            method: 'post',
            data: this.$http.adornData({
              'year': this.year,
              'month': this.month,
              'kbiCheckList': kbiCheckList
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 提交被考核人员
      postPersonListToApi () {
        return new Promise((resolve, reject) => {
          let kbiPersonList = []
          for (let item of this.kbiPersonList) {
            if (item.isAttend) {
              let personItem = {
                userId: item.userId,
                year: this.year,
                month: this.month
              }
              kbiPersonList.push(personItem)
            }
          }
          this.$http({
            url: this.$http.adornUrl(`/ren/kbiperson/save`),
            method: 'post',
            data: this.$http.adornData({
              'year': this.year,
              'month': this.month,
              'kbiPersonList': kbiPersonList,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 被考核人员多选
      allCheckedHandle () {
        for (let item of this.kbiPersonList) {
          if (this.allChecked) {
            item.isAttend = true
          } else {
            item.isAttend = false
          }
        }
      },
      // 考核人员多选
      allCheckHandle () {
        for (let item of this.kbiCheckList) {
          if (this.allCheck) {
            item.isAttend = true
          } else {
            item.isAttend = false
          }
        }
      }
    }
  }
</script>

<style scoped>
.tac{
  text-align:center;
}
</style>
