<!--业务员统计表-->

<template>
  <div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <div style="width:95%;margin:0 auto;">
        <el-form-item style="margin-bottom:5px;margin-top:10px;">
          <el-date-picker style="float:left;width:45%;" v-model="dataForm.startDate" type="date"  placeholder="开始日期"  :picker-options="pickerOptionsStart" @change="changeEnd"></el-date-picker>
          <div style="float:left;width:10%;text-align: center;">至</div>
          <el-date-picker style="float:left;width:45%;" v-model="dataForm.endDate" type="date"  placeholder="结束日期"  :picker-options="pickerOptionsEnd" @change="changeStart"></el-date-picker>
        </el-form-item>
      </div>
      <div style="width:95%;margin:0 auto;">
        <el-form-item style="width:44%;">
          <el-select v-model="dataForm.business" placeholder="业务负责人(全部)" clearable  @change=" getServiceChart">
            <el-option v-for="item in contractBusinessList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <!---->
    <div id="serviceId">
      <div class="scchart_title">
        <div>业务员统计表</div>
        <div class="scdate_title">{{monthTitle}}</div>
      </div>
      <!---->
      <van-row class="table_row scl" type="flex" align="center">
        <van-col :span="12"><div ><van-button @click.native="changeOrder()" icon="arrow-up" type="info" plain>业务员</van-button></div></van-col>
        <van-col :span="4" class="tac f15">应收</van-col>
        <van-col :span="4" class="tac f15">实收</van-col>
        <van-col :span="4" class="tac f15">未收</van-col>
      </van-row>
      <!---->
      <div style="width:95%;margin:0 auto;overflow: scroll;" :style="'max-height: ' + (documentClientHeight - 310).toString() + 'px'">
        <div class="sctable_class" v-loading="dataListLoading">
          <div v-for="(data, index) in dataList">
            <van-row v-if="data.BusinessShow" class="table_row f15">
              <van-col :span="12"><div >负责人:{{data.contractBusiness}}</div></van-col>
              <van-col :span="12"></van-col>
            </van-row>
            <van-row  v-if="data.contractBusiness != null" class="item_row">
              <van-col :span="12"><div>{{data.contractName}}</div></van-col>
              <van-col :span="4"><div class="tac">{{data.contractMoney}}</div></van-col>
              <van-col :span="4"><div class="tac">{{data.projectActuallyReceipts}}</div></van-col>
              <van-col :span="4"><div class="tac">{{data.projectNotReceipts}}</div></van-col>
            </van-row>
            <!---->
            <van-row  type="flex" align="center" v-if="data.contractBusiness != null && data.footerShow" class="table_row">
              <van-col :span="8" class="f15"><div >合计{{data.projectSum}}个项目</div></van-col>
              <van-col :span="16">
                <van-row>
                  <van-col :span="8" class="tac f15">应收</van-col>
                  <van-col :span="8" class="tac f15">实收</van-col>
                  <van-col :span="8" class="tac f15">未收</van-col>
                </van-row>
                <van-row>
                  <van-col :span="8" class="tac f14">{{data.projectShould}}</van-col>
                  <van-col :span="8" class="tac f14">{{data.projectAct}}</van-col>
                  <van-col :span="8" class="tac f14">{{data.projectNot}}</van-col>
                </van-row>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
      <!---->
      <van-row type="flex" align="center" class="sclall">
        <van-col :span="10" class="f15"><div >总共合计<span class="theme_color">{{totalProjectSum}}</span>个项目</div></van-col>
        <van-col :span="14">
          <van-row>
            <van-col :span="8" class="tac f15">应收</van-col>
            <van-col :span="8" class="tac f15">实收</van-col>
            <van-col :span="8" class="tac f15">未收</van-col>
          </van-row>
          <van-row>
            <van-col :span="8" class="tac theme_color" >{{totalProjectShould}}</van-col>
            <van-col :span="8" class="tac theme_color" >{{totalProjectAct}}</van-col>
            <van-col :span="8" class="tac theme_color" >{{totalProjectNot}}</van-col>
          </van-row>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          // 业务负责人
          business: '',
          // 类型选择
          projecttype: '',
          startDate: '',
          endDate: '',
          order: 'asc',
          sidx: 'contract_business'
        },
        monthTitle: '', // 月份标题
        // 业务负责人列表
        contractBusinessList: [],
        totalProjectSum: 0,  // 项目合计数
        totalProjectShould: 0, // 统计实收
        totalProjectAct: 0, // 统计实收
        totalProjectNot: 0, // 统计未收
        dataListLoading: false,
        dataList: []
      }
    },
    created () {
      this.dataForm.startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      this.changeEnd()
      // 业务负责人选项
      this.getContractBusinessDataListFromApi()
      this.getServiceChart()
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    methods: {
      changeOrder () {
        if (this.dataForm.order === 'asc') {
          this.dataForm.order = 'desc'
        } else {
          this.dataForm.order = 'asc'
        }
        this.getServiceChart()
      },

      // 获取数据列表
      getServiceChart () {
        // 月份标题
        if (this.dataForm.startDate === this.dataForm.endDate || this.dataForm.endDate === '') {
          // new Date(this.dataForm.startDate)
          this.monthTitle = new Date(this.dataForm.startDate).getFullYear() + '年' + (new Date(this.dataForm.startDate).getMonth() + 1) + '月至今'
        } else {
          this.monthTitle = new Date(this.dataForm.startDate).getFullYear() + '年' + (new Date(this.dataForm.startDate).getMonth() + 1) + '月至' +
            new Date(this.dataForm.endDate).getFullYear() + '年' + (new Date(this.dataForm.endDate).getMonth() + 1) + '月'
        }
        // 时间判断 （结束时间大于开始时间 ，则清空结束时间）
        if (new Date(this.dataForm.startDate) >= new Date(this.dataForm.endDate)) {
          this.dataForm.endDate = null
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/finance/account/getFinanceList'),
          method: 'get',
          params: this.$http.adornParams({
            'projecttype': '',
            'business': this.dataForm.business,
            'startDate': this.dataForm.startDate,
            'endDate': this.dataForm.endDate,
            'order': this.dataForm.order,
            'sidx': this.dataForm.sidx
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableDataInit(data.list)
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },

      // 表格初始化
      tableDataInit (datalist) {
        this.Should = 0, // 统计实收
          this.Act = 0, // 统计实收
          this.Not = 0, // 统计未收
          // this.totalProjectSum = 0 // 项目总和
          this.totalProjectShould = 0
        this.totalProjectAct = 0
        this.totalProjectNot = 0
        this.dataList = []
        let contractBusiness = null
        datalist.forEach((item, index) => {
          // 选择业务负责人的时候
          item.BusinessShow = false
          item.footerShow = false
          let outputtemp = parseFloat((item.projectActuallyOutput == null ? 0 : item.projectActuallyOutput).toFixed(2))
        })

        // 统计结算
        datalist.forEach((item, index) => {
          if (contractBusiness !== item.contractBusiness) {
            item.BusinessShow = true
            contractBusiness = item.contractBusiness
            let projectSum = 0
            let projectShould = 0
            let projectAct = 0
            let projectNot = 0

            for (let i = index; i < datalist.length; i++) {
              if (datalist[i].contractBusiness === contractBusiness) {
                projectSum += 1

                projectShould += datalist[i].contractMoney
                projectAct += datalist[i].projectActuallyReceipts
                projectNot += datalist[i].projectNotReceipts

                // 总的合计
                this.totalProjectShould += datalist[i].contractMoney
                this.totalProjectAct += datalist[i].projectActuallyReceipts
                this.totalProjectNot += datalist[i].projectNotReceipts
                // 项目数量
                datalist[i].projectSum = projectSum
                // 应收
                datalist[i].projectShould = parseFloat(projectShould.toFixed(2))
                // 实收
                datalist[i].projectAct = parseFloat(projectAct.toFixed(2))
                // 未收
                datalist[i].projectNot = parseFloat(projectNot.toFixed(2))
                if (i >= datalist.length - 1) datalist[i].footerShow = true
              } else {
                datalist[i - 1].footerShow = true
                break
              }
            }
            this.totalProjectAct = parseFloat(this.totalProjectAct).toFixed(2)
            this.totalProjectNot = parseFloat(this.totalProjectNot).toFixed(2)
          }
        })

        this.dataList = datalist
        this.totalProjectSum = this.dataList.length
        console.log(this.datalist)
      },

      // 从后台获得业务负责人数据列表内容  填充至选项
      getContractBusinessDataListFromApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/finance/account/getContractBusinessList'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.contractBusinessList = data.list
              resolve(data.list)
            } else {
              this.contractBusinessList = []
            }
          })
        })
      },

      // 打印报表
      printChart () {
        const print = document.getElementById('serviceId').innerHTML
        // 把当前页面替换成要打印的内容
        document.body.innerHTML = print
        // 打印
        window.print()
        // 刷新页面
        window.location.reload()
      },
      // 开始时间改变
      changeStart () {
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          disabledDate: (time) => {
            return time.getTime() > this.dataForm.endDate
          }
        })
        this.pageIndex = 1
        this.getServiceChart()
      },
      // 结束时间改变
      changeEnd () {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate: (time) => {
            return time.getTime() < this.dataForm.startDate
          }
        })
        this.pageIndex = 1
        this.getServiceChart()
      }

    }

  }
</script>

<style lang="less">
  .theme_color{
    color:@stylecolor;
  }
  .month_type{
    width: 150px;
  }
  .scchart_title {
    width: 100%;
    text-align: center;
    margin-top: 5px;
    font-size: 17px;
    font-weight: 600;
  }
  .scchart_title .scdate_title{
    margin-top: 4px;
    font-size: 17px;
    font-weight: 500;
  }
  .sctable_class{
    margin-top: 5px;
  }
  .sctable_class .table_row{
    padding-top:5px;
    padding-bottom:5px;
    border-bottom: 1px solid #6f7180;
  }
  .f15{
    font-size:15px;
    font-weight: 600;
  }
  .f14{
    font-size:14px;
    font-weight: 600;
  }
  .sctable_class .item_row{
    padding-top:5px;
    padding-bottom:5px;
    border-bottom: 1px dotted #6f7180;
  }
  .sctable_class .item_row:hover{
    cursor: pointer;
    color:black;
    background:#1989fa;
    opacity:0.7;

  }
  .sctable_class .table_row .grid-header{
    font-weight: 700;
    font-size: 16px;
    color: rgba(15, 17, 23, 0.78);
  }
  .sctable_class .table_row .group-header{
    font-weight: 700;
    font-size: 15px;
  }

  .ServiceChartcentershow{
    float:left;
    margin-left:16px;
  }
  .ServiceChartTitlecentershow{
    margin-left:12px;
    text-align: center;
  }
  .sctable_class .item_footer{
    color: #00b7ee;
  }
  .el-form-item{
    margin-bottom: 2px;
  }
  .tac{
    text-align: center;
  }
  /*.sctable_class .el-dropdown-menu__item{*/
    /*line-hright:0px;*/
  /*}*/

  .scl .van-button {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 24px;
    margin: 0;
    padding: 0px 20px 10px 5px;
    font-size: 13px;
    line-height: 24px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    -webkit-transition: opacity .2s;
    transition: opacity .2s;
    -webkit-appearance: none;
    -webkit-text-size-adjust: 100%;
  }
  .scl{
    width:95%;margin:0 auto;border-bottom:1px dotted black;padding-bottom:10px;padding-top:5px;
  }
  .sclall{
    border-top:1px dotted black;margin-top:10px;padding-top:10px;
  }
</style>



