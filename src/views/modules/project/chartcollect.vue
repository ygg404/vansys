<template>
  <div class="mod-config" style="width:98%;margin-left:1%;margin-right:1%;">
    <van-row  type="flex" align="center" justify="space-around" style="padding-top:2px;padding-bottom:2px;margin-top:5px;margin-bottom:5px;border-bottom: 1px solid #e3d8d8;border-top: 1px solid #e3d8d8;">
      <van-col span="18" class="wgns">
        <van-cell center @click="sedShow = true">项目启动时间: {{sdateStr}} 至 {{edateStr}}</van-cell>
        <van-calendar v-model="sedShow" type="range" :default-date="defaultDateArray" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" />
      </van-col>
       <van-col span="5">
        <van-button type="info" size="small" @click="goBack" style="margin-left:10px;">返回</van-button>
      </van-col>
    </van-row>

      <div id="chartId" style="width: 100%">
        <div class="chart_title">
          <div>各部门汇总产值统计表</div>
          <div class="date_title">{{dateTitle}}</div>
        </div>
        <div class="table_class" v-loading="dataListLoading">
          <van-row class="table_row">
            <van-col :span="8">
              <div class="grid-header">工作组</div>
            </van-col>
            <van-col :span="8">
              <div class="grid-header">项目个数</div>
            </van-col>
            <van-col :span="8">
              <div class="grid-header">产值</div>
            </van-col>
          </van-row>
          <div v-for="(data, index) in dataList">
            <van-row class="table_row item_row">
              <van-col :span="8">
                <div>{{data.groupName}}</div>
              </van-col>
              <van-col :span="8">
                <div>{{data.projectNum}}</div>
              </van-col>
              <van-col :span="8">
                <div>{{data.output}}</div>
              </van-col>
            </van-row>
          </div>
          <van-row class="table_row item_footer">
            <van-col :span="8">
              <div class="group-header">合计</div>
            </van-col>
            <van-col :span="8">
              <div class="group-header">{{totalProjectNum}}</div>
            </van-col>
            <van-col :span="8">
              <div class="group-header">{{totalOutPut}}</div>
            </van-col>
          </van-row>
        </div>
      </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      sedShow: false,
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2025, 10, 1),
      defaultDateArray: [],
      sdateStr: '',
      edateStr: '',
      dataForm: {
        startDate: '',
        endDate: ''
      },
      totalProjectNum: 0, // 合计项目数
      totalOutPut: 0, // 合计产值
      dateTitle: '', // 时间标题
      dataList: [],
      dataListLoading: false
    }
  },
  created () {
    this.sdateStr =  moment (new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM-DD')
    this.edateStr = moment(new Date()).format('YYYY-MM-DD')
    this.defaultDateArray = [new Date(this.sdateStr), new Date()]
    this.getChartCollectDat()
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'project-project' })
    },
    onConfirm (date) {
      const [start, end] = date
      this.dataForm.startDate = start
      this.dataForm.endDate = end
      this.sdateStr = moment(this.dataForm.startDate).format('YYYY-MM-DD')
      this.edateStr = moment(this.dataForm.endDate).format('YYYY-MM-DD')
      this.sedShow = false
      this.getChartCollectDat()
    },
    // 获取数据列表
    getChartCollectDat () {
      this.dateTitle = this.sdateStr + '至' + this.sdateStr
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/project/chartcollect/list'),
        method: 'get',
        params: this.$http.adornParams({
          startDate: this.sdateStr,
          endDate: this.edateStr
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.totalProjectNum = 0
          this.totalOutPut = 0
          this.dataList = data.list
          data.list.forEach((item, index) => {
            this.totalProjectNum += item.projectNum
            this.totalOutPut += item.output
          })
          this.totalOutPut = this.totalOutPut.toFixed(2)
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      })
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
  margin-top: 17px;
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
  line-height: 150%;
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
  font-size: 15px;
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
.wgns .van-cell{
  padding:0px;
  font-size:15px;
}
</style>
