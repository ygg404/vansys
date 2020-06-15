<template>
  <div style="width:98%;margin-left:1%;margin-right:1%;">
    <van-row type="flex" justify="space-between" align="bottom" class="timerow">
      <van-col span="12">
        <van-cell center title="质检时间" @click="sedShow = true">{{sdateStr}}</van-cell>
      </van-col>
      <van-col span="3">
        <van-cell center title="至" @click="sedShow = true" />
      </van-col>
      <van-col span="8">
        <van-cell center @click="sedShow = true">{{edateStr}}</van-cell>
      </van-col>
      <van-calendar
        v-model="sedShow"
        type="range"
        :default-date="defaultDateArray"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
      />
    </van-row>

    <chartcommonModule :wgName="workgroupname" :wgList="workGroupList" @wgc="onworkGroupConfirm" @ech="exportChartHandle" @gb="goBack"/>
    <!---->
    <div id="chartId">
      <div class="chart_title">
        <div>质量统计表</div>
        <div class="date_title">{{dateTitle}}</div>
      </div>
      <div class="table_class" v-loading="dataListLoading">
        <van-row class="table_row">
          <van-row class="ptpb">
            <van-col :span="14">
              <div style="padding-left:10px;font-weight: 700;font-size: 15px;">项目名称</div>
            </van-col>
            <van-col :span="5">
              <div class="tac" style="font-weight: 700;font-size: 15px;">质量评分</div>
            </van-col>
            <van-col :span="5">
              <div class="tac" style="font-weight: 700;font-size: 15px;">质量等级</div>
            </van-col>
          </van-row>
          <!---->
          <van-row class="item_row pb10">
            <van-col :span="8">
              <div class="tac" style="font-weight: 700;font-size: 15px;">项目负责人</div>
            </van-col>
            <van-col :span="8">
              <div class="tac" style="font-weight: 700;font-size: 15px;">质检员</div>
            </van-col>
            <van-col :span="8">
              <div class="tac" style="font-weight: 700;font-size: 15px;">质检审核员</div>
            </van-col>
          </van-row>
        </van-row>
        <div :key="index" v-for="(data, index) in dataList" class="ptpb" style="padding-top:5px;">
          <van-row v-if="data.groupShow" class="table_row ptpb">
            <van-col :span="10" style="padding-left:10px;">
              <div class="group-header">{{data.groupName}}</div>
            </van-col>
            <van-col :span="14"></van-col>
          </van-row>

          <van-row v-if="data.groupName != null" class="ptpb">
            <van-col :span="14">
              <div>{{data.projectName}}</div>
            </van-col>
            <van-col :span="5">
              <div class="tac">{{data.qualityScore === null? '&ensp; ': data.qualityScore}}</div>
            </van-col>
            <van-col :span="5">
              <div class="tac">{{data.qualityLevel}}</div>
            </van-col>
          </van-row>
          <!---->
          <van-row class="item_row ptpb">
            <van-col :span="8">
              <div class="tac">{{data.projectCharge === null? '&ensp; ': data.projectCharge}}</div>
            </van-col>
            <van-col :span="8">
              <div class="tac">{{data.qualityUserName}}</div>
            </van-col>
            <van-col :span="8">
              <div class="tac">{{data.qualityConfirmName}}</div>
            </van-col>
          </van-row>

          <van-row v-if="data.groupName != null && data.footerShow" class="table_row ptpb">
            <van-row>
              <van-col :span="1"></van-col>
              <van-col :span="23">
                <div class="group-header ptpb">{{data.groupName}}:合计{{data.projectSum}}个项目</div>
              </van-col>
            </van-row>
            <van-row>
              <van-col :span="24">
                <div
                  class="ghc ptpb"
                >优:{{data.excellentCount}}项;良:{{data.goodCount}}项;及格:{{data.passCount}}项;不及格:{{data.failCount}}项;优良:{{data.goodexceSum}}项;优良率:{{data.goodRate}}%;</div>
              </van-col>
            </van-row>
          </van-row>
        </div>
        <van-row class="table_row item_footer">
          <van-row class="fs">
            <van-col :span="24">
              <div
                class="group-header"
              >总共合计{{totalProjectSum}}个项目 &nbsp;&nbsp;&nbsp;优:{{projectSum.excellentCount}}项;良:{{projectSum.goodCount}}项;及格:{{projectSum.passCount}}项;不及格:{{projectSum.failCount}}项;优良:{{projectSum.goodexceSum}}项;优良率:{{projectSum.goodRate}}%;</div>
            </van-col>
          </van-row>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import chartcommonModule from '@/components/chartcommon-module'
import {treeDataTranslate} from '@/utils'
export default {
  data () {
    return {
      workgroupname: '',

      sedShow: false,
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2025, 10, 1),
      defaultDateArray: [],
      sdateStr: '',
      edateStr: '',

      dataForm: {
        groupId: '',
        startDate: '',
        endDate: ''
      },
      dateTitle: '', // 时间标题
      workGroupList: [],
      totalOutput: 0, // 合计总产值
      totalProjectSum: 0, // 项目合计数
      dataList: [],
      projectSum: {},
      dataListLoading: false
    };
  },
  components: {
    chartcommonModule
  },
  created () {
    this.sdateStr = moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM-DD')
    this.edateStr = moment(new Date()).format('YYYY-MM-DD')
    this.defaultDateArray = [new Date(this.sdateStr), new Date()]
    this.getWorkGroupDataListFromApi().then(list => {
      this.workGroupList = this.getBranchChildList(treeDataTranslate(list, 'id', 'pid'))
    })
    this.getOutputQuality()
  },

  methods: {
    onworkGroupConfirm (item) {
      this.dataForm.groupId = item.id
      this.workgroupname = item.name
      this.getOutputQuality()
    },
    goBack () {
      this.$router.push({ name: 'project-project' })
    },
    // 从后台获得工作组数据列表内容  填充至选项
    getWorkGroupDataListFromApi () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/set/workgroup/list'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            resolve(data.list)
          } else {
            this.workGroupList = []
          }
        })
      })
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
    // 表格初始化
    tableDataInit (datalist) {
      this.dataList = []
      let groupName = null
      // 总项目 的 优良及格项
      this.projectSum = {
        'excellentCount': 0,
        'goodCount': 0,
        'passCount': 0,
        'failCount': 0,
        'goodexceSum': 0,
        'goodRate': 0
      }
      this.totalProjectSum = 0
      datalist.forEach((item, index) => {
        item.groupShow = false
        item.footerShow = false
        this.totalProjectSum += 1
        if (item.qualityScore < 60) {
          item.qualityLevel = '不合格'
          this.projectSum.failCount += 1
        } else if (item.qualityScore >= 60 && item.qualityScore <= 70) {
          item.qualityLevel = '合格'
          this.projectSum.passCount += 1
        } else if (item.qualityScore > 70 && item.qualityScore < 90) {
          item.qualityLevel = '良'
          this.projectSum.goodCount += 1
        } else if (item.qualityScore >= 90) {
          item.qualityLevel = '优'
          this.projectSum.excellentCount += 1
        }
      })
      this.projectSum.goodexceSum = this.projectSum.excellentCount + this.projectSum.goodCount
      if (this.totalProjectSum === 0) {
        this.projectSum.goodRate = 0
      } else {
        this.projectSum.goodRate = (this.projectSum.goodexceSum * 100 / this.totalProjectSum).toFixed(2)
      }
      datalist.forEach((item, index) => {
        if (groupName !== item.groupName) {
          item.groupShow = true
          groupName = item.groupName
          let excellentCount = 0    // 优
          let goodCount = 0         // 良
          let passCount = 0         // 及格
          let failCount = 0         // 不及格
          let projectSum = 0   // 项目数
          for (let i = index; i < datalist.length; i++) {
            if (datalist[i].groupName === groupName) {
              if (datalist[i].qualityScore < 60) {
                failCount += 1
              } else if (datalist[i].qualityScore >= 60 && datalist[i].qualityScore <= 70) {
                passCount += 1
              } else if (datalist[i].qualityScore > 70 && datalist[i].qualityScore < 90) {
                goodCount += 1
              } else if (datalist[i].qualityScore >= 90) {
                excellentCount += 1
              }
              projectSum += 1
              datalist[i].failCount = failCount
              datalist[i].passCount = passCount
              datalist[i].goodCount = goodCount
              datalist[i].excellentCount = excellentCount
              datalist[i].projectSum = projectSum
              datalist[i].goodexceSum = excellentCount + goodCount
              datalist[i].goodRate = (datalist[i].goodexceSum * 100 / projectSum).toFixed(2)
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
      console.log(this.dataList)
    },

    onConfirm (date) {
      const [start, end] = date
      this.dataForm.startDate = start
      this.dataForm.endDate = end
      this.sdateStr = moment(this.dataForm.startDate).format('YYYY-MM-DD')
      this.edateStr = moment(this.dataForm.endDate).format('YYYY-MM-DD')
      this.sedShow = false
      this.getOutputQuality()
    },
    // 获取数据列表
    getOutputQuality () {
      this.dateTitle = this.sdateStr + '至' + this.sdateStr
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/project/chartquality/list'),
        method: 'get',
        params: this.$http.adornParams({
          groupId: this.dataForm.groupId,
          startDate: this.sdateStr,
          endDate: this.edateStr
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
    // 导出excel表
    exportChartHandle () {
      this.dataListLoading = true
      let that = this

      let startDate =
        this.dataForm.startDate === null || this.dataForm.startDate === ''
          ? ''
          : moment(new Date(this.dataForm.startDate)).format('YYYY-MM-DD')
      let endDate =
        this.dataForm.endDate === null || this.dataForm.endDate === ''
          ? ''
          : moment(new Date(this.dataForm.endDate)).format('YYYY-MM-DD')
      let downTitle = this.dateTitle
      let downurl =
        window.SITE_CONFIG['baseUrl'] +
        '/project/chartquality/exportExcel?startDate=' +
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
          let filename = downTitle + '质量统计表.xls'
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
    },
    // 打印报表
    printChart () {
      const print = document.getElementById('chartId').innerHTML
      // 把当前页面替换成要打印的内容
      document.body.innerHTML = print
      // 打印
      window.print()
      // 刷新页面
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.date_type {
  max-width: 140px;
}
.chart_title {
  width: 100%;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
}
.chart_title .date_title {
  margin-top: 4px;
  font-size: 16px;
  font-weight: 500;
}

.table_class {
  margin-top: 1px;
}
.table_class .table_row {
  border-bottom: 1px solid #6f7180;
}
.table_class .item_row {
  border-bottom: 1px solid rgba(111, 113, 128, 0.56);
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
.table_class .table_row .ghc {
  font-weight: 700;
  font-size: 15px;
}
.table_class .item_footer {
  color: #00b7ee;
}
.tac {
  text-align: center;
}
.ptpb {
  padding-top: 3px;
  padding-bottom: 3px;
}
.pb10 {
  padding-top: 3px;
  padding-bottom: 10px;
}
.fs {
  padding-top: 10px;
  padding-bottom: 10px;
}
.timerow {
  border-top: 1px solid rgb(195, 197, 199);
  border-bottom: 1px solid rgb(195, 197, 199);
}
</style>
