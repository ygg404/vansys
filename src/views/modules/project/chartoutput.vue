<template>
  <div class="mod-config">
    <van-row type="flex" justify="space-between" align="bottom" class="timerow">
      <van-col span="12">
        <van-cell center title="结算时间" @click="sdshow = true">{{sDateStr}}</van-cell>
        <van-popup v-model="sdshow" position="bottom">
          <van-datetime-picker
            v-model="dataForm.startDate" type="year-month" title="选择时间"
            :min-date="minDate" :max-date="maxDate" :formatter="formatter"
            @cancel="sdshow = false" @confirm="sdPicker"/>
        </van-popup>
      </van-col>
      <van-col span="2">
        <van-cell center title="至" />
      </van-col>
      <van-col span="8">
        <van-cell center @click="edshow = true">{{eDateStr}}</van-cell>
        <van-popup v-model="edshow" position="bottom">
          <van-datetime-picker
            v-model="dataForm.endDate" type="year-month" title="选择时间"
            :min-date="minDate" :max-date="maxDate" :formatter="formatter"
            @cancel="edshow = false" @confirm="edPicker"/>
        </van-popup>
      </van-col>
    </van-row>
    <chartcommonModule
      :wgName="workgroupname"
      :wgList="workGroupList"
      @wgc="onworkGroupConfirm"
      @ech="exportChartHandle"
      @gb="goBack"
    ></chartcommonModule>

    <div id="chartId">
      <div class="chart_title">
        <div>产值统计表</div>
        <div class="date_title">{{monthTitle}}</div>
      </div>
      <div class="table_class" v-loading="dataListLoading">
        <van-row class="table_row">
          <van-row class="item_row" style="padding-top:3px;padding-bottom:3px;">
            <van-row style="margin-top:3px;margin-bottom:3px;">
              <van-col :span="1" />
              <van-col :span="15">
                <div class="group-header">项目名称</div>
              </van-col>
              <van-col :span="1" />
              <van-col :span="5">
                <div class="group-header">项目负责人</div>
              </van-col>
              <van-col :span="2" />
            </van-row>
            <van-col :span="1" />
            <van-col :span="7" center>
              <div class="group-header">项目启动时间</div>
            </van-col>
            <van-col :span="1" />
            <van-col :span="7" center>
              <div class="group-header">作业完成时间</div>
            </van-col>
            <van-col :span="1" />
            <van-col :span="7" center>
              <div class="group-header">实际产值</div>
            </van-col>
          </van-row>
        </van-row>

        <!---->
        <div v-for="(data, index) in dataList">
          <van-row v-if="data.groupShow" class="table_row" style="padding-top:3px;padding-bottom:3px;">
            <van-col :span="1"></van-col>
            <van-col :span="12">
              <div class="group-header">{{data.groupName}}</div>
            </van-col>
            <van-col :span="11"></van-col>
          </van-row>
          <van-row v-if="data.groupName != null" class="item_row" style="padding-top:3px;padding-bottom:3px;">
            <van-row style="margin-top:3px;margin-bottom:3px;">
              <van-col :span="1" />
              <van-col :span="15">
                <div>{{data.projectName}}</div>
              </van-col>
              <van-col :span="1" />
              <van-col :span="5">
                <div>{{data.projectCharge === null? '&ensp; ':data.projectCharge}}</div>
              </van-col>
              <van-col :span="2" />
            </van-row>
            <van-col :span="1" />
            <van-col :span="7" center>
              <div>{{data.projectStartDateTime === null? '&ensp; ':data.projectStartDateTime}}</div>
            </van-col>
            <van-col :span="1" />
            <van-col :span="7" center>
              <div>{{data.wFinishDateTime === null? '&ensp; ':data.wFinishDateTime}}</div>
            </van-col>
            <van-col :span="1" />
            <van-col :span="7" center>
              <div>{{data.projectActuallyOutput}}</div>
            </van-col>
          </van-row>
          <van-row v-if="data.groupName != null && data.footerShow" class="table_row" style="padding-top:3px;padding-bottom:3px;">
            <van-col :span="1"></van-col>
            <van-col :span="15">
              <div class="group-header">{{data.groupName}}:合计{{data.projectSum}}个项目</div>
            </van-col>
            <van-col :span="1"></van-col>
            <van-col :span="6">
              <div class="group-header">{{data.outputSum}}</div>
            </van-col>
            <van-col :span="1"></van-col>
          </van-row>
        </div>
        <van-row class="table_row item_footer" style="padding-top:3px;padding-bottom:3px;">
          <van-col :span="1"></van-col>
          <van-col :span="15">
            <div class="group-header">总共合计{{totalProjectSum}}个项目</div>
          </van-col>
          <van-col :span="1"></van-col>
          <van-col :span="6">
            <div class="group-header">{{totalOutput}}</div>
          </van-col>
          <van-col :span="1"></van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import chartcommonModule from '@/components/chartcommon-module'
export default {
  data () {
    return {
      sdshow: false,
      edshow: false,
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2025, 10, 1),
      sDateStr: '',
      eDateStr: '',
      workgroupname: '',
      dataForm: {
        groupId: '',
        startDate: '',
        endDate: ''
      },
      monthTitle: '', // 月份标题
      workGroupList: [],
      totalOutput: 0, // 合计总产值
      totalProjectSum: 0, // 项目合计数
      dataListLoading: false,
      dataList: []
    }
  },
  components: {
    chartcommonModule
  },
  created () {
    let datenow = new Date()
    this.dataForm.startDate = this.dataForm.endDate = new Date(datenow.getFullYear(), datenow.getMonth() - 1, 1)
    this.getWorkGroupDataListFromApi()
    this.getOutputChart()
  },
  methods: {
    sdPicker (val) {
      this.dataForm.startDate = val
      this.dataForm.endDate = this.dataForm.startDate
      this.sDateStr = this.eDateStr = moment(this.dataForm.startDate).format(
       'YYYY-MM'
      )
      this.getOutputChart()
      this.sdshow = false
    },
    edPicker (val) {
      this.dataForm.endDate = val
      if (this.dataForm.endDate < this.dataForm.startDate) {
        this.dataForm.startDate = this.dataForm.endDate
        this.sDateStr = moment(this.dataForm.startDate).format('YYYY-MM')
      }
      this.eDateStr = moment(this.dataForm.endDate).format('YYYY-MM')
      this.getOutputChart()
      this.edshow = false
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    onworkGroupConfirm (item) {
      this.dataForm.groupId = item.id
      this.workgroupname = item.name
      this.getOutputChart()
    },
    goBack () {
      this.$router.push({ name: 'project-project' })
    },
    // 获取所有子部门
    getBranchChildList (branchlist) {
      let childList = []
      for (let branch of branchlist) {
        if (branch.children !== undefined) {
          childList = childList.concat(this.getBranchChildList(branch.children))
        } else {
          childList.push(branch)
        }
      }
      return childList
    },
    // 获取数据列表
    getOutputChart () {
      // 月份标题
      if (this.dataForm.startDate === this.dataForm.endDate) {
        this.monthTitle = this.dataForm.startDate.getFullYear() + '年' + (this.dataForm.startDate.getMonth() + 1) + '月'
      } else {
        this.monthTitle = this.dataForm.startDate.getFullYear() + '年' + (this.dataForm.startDate.getMonth() + 1) + '月至' +
          this.dataForm.endDate.getFullYear() + '年' + (this.dataForm.endDate.getMonth() + 1) + '月'
      }
      this.sDateStr = moment(new Date(this.dataForm.startDate.getFullYear(), this.dataForm.startDate.getMonth(), 1)).format('YYYY-MM')
      this.eDateStr = moment(new Date(this.dataForm.endDate.getFullYear(), this.dataForm.endDate.getMonth(), 1)).format('YYYY-MM')
      let passeDateStr = moment(new Date(this.dataForm.endDate.getFullYear(), this.dataForm.endDate.getMonth() + 1, 1)).format('YYYY-MM-DD')
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/project/chartoutput/list'),
        method: 'get',
        params: this.$http.adornParams({
          groupId: this.dataForm.groupId,
          startDate: this.sDateStr,
          endDate: passeDateStr
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // this.dataList = data.list
          this.tableDataInit(data.list)
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      })
    },
    // 表格初始化
    tableDataInit (datalist) {
      this.totalOutput = 0
      this.totalProjectSum = 0
      this.dataList = []
      let groupName = null
      datalist.forEach((item, index) => {
        item.groupShow = false
        item.footerShow = false
        this.totalProjectSum += 1
        let outputtemp = parseFloat(
          (item.projectActuallyOutput == null
            ? 0
            : item.projectActuallyOutput
          ).toFixed(2)
        )
        this.totalOutput = parseFloat(
          (this.totalOutput + outputtemp).toFixed(2)
        )
      })
      console.log(this.totalOutput)
      datalist.forEach((item, index) => {
        if (groupName !== item.groupName) {
          item.groupShow = true
          groupName = item.groupName
          let projectSum = 0
          let outputSum = 0
          for (let i = index; i < datalist.length; i++) {
            if (datalist[i].groupName === groupName) {
              projectSum += 1
              outputSum += datalist[i].projectActuallyOutput
              datalist[i].projectSum = projectSum
              datalist[i].outputSum = parseFloat(outputSum.toFixed(2))
              if (i >= datalist.length - 1) datalist[i].footerShow = true
            } else {
              datalist[i - 1].footerShow = true
              break
            }
          }
          // this.dataList.push(groupdat)
        }
      })
      this.dataList = datalist
      console.log(this.datalist)
    },
    // 从后台获得工作组数据列表内容  填充至选项
    getWorkGroupDataListFromApi () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/set/workgroup/list'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.workGroupList = this.getBranchChildList(treeDataTranslate(data.list, 'id', 'pid'))
            console.log(this.workGroupList)
            resolve(data.list)
          } else {
            this.workGroupList = []
          }
        })
      })
    },

    // 导出excel表
    exportChartHandle () {
      this.dataListLoading = true
      let that = this
      let startDate = moment(
        new Date(
          this.dataForm.startDate.getFullYear(),
          this.dataForm.startDate.getMonth(),
          1
        )
      ).format('YYYY-MM-DD')
      let endDate = moment(
        new Date(
          this.dataForm.endDate.getFullYear(),
          this.dataForm.endDate.getMonth() + 1,
          1
        )
      ).format('YYYY-MM-DD')
      let downTitle = this.monthTitle
      let downurl =
        window.SITE_CONFIG['baseUrl'] +
        '/project/chartoutput/exportExcel?startDate=' +
        startDate +
        '&endDate=' +
        endDate +
        '&groupId=' +
        this.dataForm.groupId
      let xhr = new XMLHttpRequest()
      // GET请求,请求路径url,async(是否异步)
      xhr.open('get', downurl, true)
      // 设置请求头参数的方式,如果没有可忽略此行代码
      xhr.setRequestHeader('token', Vue.cookie.get('token'))
      // 设置响应类型为 blob
      xhr.responseType = 'blob'
      // 关键部分
      xhr.onload = function (e) {
        that.dataListLoading = false
        // 如果请求执行成功
        if (this.status === 200) {
          let blob = this.response
          console.log(e)
          let filename = downTitle + '产值统计表.xls'
          let a = document.createElement('a')
          // 创键临时url对象
          var url = URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          // 释放之前创建的URL对象
          window.URL.revokeObjectURL(url)
        }
      }
      // 发送请求
      xhr.send()
    }
  }
}
</script>

<style scoped>
.month_type {
  width: 150px;
}
.chart_title {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  font-size: 17px;
  font-weight: 700;
}
.chart_title .date_title {
  margin-top: 4px;
  font-size: 16px;
  font-weight: 500;
}
.table_class {
  margin-top: 10px;
}
.table_class .table_row {
  border-bottom: 1px solid #6f7180;
}
.table_class .item_row {
  border-bottom: 1px solid #6f7180;
}
.table_class .item_row:hover {
  cursor: pointer;
  background-color: rgba(0, 183, 238, 0.59);
}
.table_class .table_row .grid-header {
  font-weight: 900;
  font-size: 16px;
  line-height: 150%;
  color: rgba(15, 17, 23, 0.61);
}
.table_class .table_row .group-header {
  font-weight: 700;
  font-size: 15px;
}
.table_class .item_footer {
  color: #00b7ee;
}
.wgns .van-cell {
  padding: 10px 0px;
}
.timerow {
  border-top: 1px solid rgb(195, 197, 199);
  border-bottom: 1px solid rgb(195, 197, 199);
}
.operrow .van-button {
  height: 37px;
  border-radius: 5px;
}
</style>
