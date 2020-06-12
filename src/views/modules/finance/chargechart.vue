<!--收费统计表-->
<template>
 <div >
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
         <el-select v-model="dataForm.business" placeholder="业务负责人(全部)" clearable  @change="getChargeChart">
           <el-option v-for="item in ContractBusinessList" :key="item" :label="item" :value="item"></el-option>
         </el-select>
       </el-form-item>
     </div>
   </el-form>
   <!---->
   <div id="chartId">
     <div class="ccchart_title">
       <div>收费统计表</div>
       <div class="ccdate_title">{{dateTitle}}</div>
     </div>
   </div>
   <!---->
   <div style="margin-top:5px;">
     <div :style="'max-height: ' + (documentClientHeight - 300).toString() + 'px'" style="width:100%;overflow: scroll;">
       <table class="cctable">
         <thead>
         <tr>
           <td class="tac" style="font-weight: 600;font-size:15px;">项目名称</td>
           <td class="tac" style="font-weight: 600;font-size:15px;">委托单位</td>
           <td class="tac" style="font-weight: 600;font-size:15px;">联系人</td>
           <td class="tac" style="font-weight: 600;font-size:15px;">联系电话</td>
           <td class="tac" style="font-weight: 600;font-size:15px;">应收</td>
           <td class="tac" style="font-weight: 600;font-size:15px;">实收</td>
           <td class="tac" style="font-weight: 600;font-size:15px;">未收</td>
           <td class="tac" style="font-weight: 600;font-size:15px;">业务负责人</td>
         </tr>
         </thead>
         <tbody v-for="(data, index) in dataList">
         <tr v-if="data.contractBusiness != null">
           <td class="tac" style="min-width:200px;">{{data.contractName}}</td>
           <td class="tac" style="min-width:136px;">{{data.contractAuthorize}}</td>
           <td class="tac" style="min-width:64px;">{{data.username}}</td>
           <td class="tac" style="min-width:88px;">{{data.userphone}}</td>
           <td class="tac" style="min-width:80px;">{{data.contractMoney}}</td>
           <td class="tac" style="min-width:80px;">{{data.projectActuallyReceipts}}</td>
           <td class="tac" style="min-width:80px;">{{data.projectNotReceipts}}</td>
           <td class="tac" style="min-width:80px;">{{data.contractBusiness}}</td>
         </tr>
         </tbody>
       </table>
     </div>



     <!---->
     <van-row type="flex" align="center" class="sclall">
       <van-col :span="10" class="f15"><div >总共合计<span style="color:#1989fa;">{{totalProjectSum}}</span>个项目</div></van-col>
       <van-col :span="14">
         <van-row>
           <van-col :span="8" class="tac f15">应收</van-col>
           <van-col :span="8" class="tac f15">实收</van-col>
           <van-col :span="8" class="tac f15">未收</van-col>
         </van-row>
         <van-row>
           <van-col :span="8" class="tac" style="color:#1989fa;">{{totalProjectShould}}</van-col>
           <van-col :span="8" class="tac" style="color:#1989fa;">{{totalProjectAct}}</van-col>
           <van-col :span="8" class="tac" style="color:#1989fa;">{{totalProjectNot}}</van-col>
         </van-row>
       </van-col>
     </van-row>

   </div>
 </div>
</template>

<script>
  import moment from 'moment'
  export default {
    data () {
      return {
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        dataForm: {
          key: '',
          // 业务负责人
          business: '',
          // 类型选择
          projecttype: '',
          startDate: '',
          endDate: '',
          sidx: '',
          order: 'asc'
        },
        dateTitle: '', // 日期标题
        // 业务负责人列表
        ContractBusinessList: [],
        totalProjectSum: 0,  // 项目合计数
        totalProjectShould: 0, // 统计实收
        totalProjectAct: 0, // 统计实收
        totalProjectNot: 0, // 统计未收
        dataListLoading: false,
        dataList: ''
      }
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    created () {
      this.dataForm.startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      this.changeEnd()
      // 业务负责人选项
      this.getContractBusinessDataListFromApi()
      this.dataForm.startDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM-DD')

    },
    methods: {
      // 获取数据列表
      getChargeChart () {
        this.dateTitle = (this.dataForm.startDate === null ? '' : moment(this.dataForm.startDate).format('YYYY-MM-DD')) + '至' + (this.dataForm.endDate === '' ? '今' : moment(this.dataForm.endDate).format('YYYY-MM-DD'))
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/finance/account/getFinanceList'),
          method: 'get',
          params: this.$http.adornParams({
            'projectType': '',
            'business': this.dataForm.business,
            'startDate': this.dataForm.startDate,
            'sidx': this.dataForm.sidx,
            'endDate': this.dataForm.endDate,
            'order': this.dataForm.order
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
          this.Act = 0, //统计实收
          this.Not = 0, //统计未收
          this.totalProjectSum = 0 //项目总和
        this.totalProjectShould = 0
        this.totalProjectAct = 0
        this.totalProjectNot = 0
        this.dataList = []
        let contractBusiness = null
        datalist.forEach((item, index) => {
          //选择业务负责人的时候
          item.BusinessShow = false
          item.footerShow = false
          this.totalProjectSum += 1
          let outputtemp = parseFloat((item.projectActuallyOutput == null ? 0 : item.projectActuallyOutput).toFixed(2))

        })

        //统计结算
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

                projectShould +=  datalist[i].contractMoney
                projectAct += datalist[i].projectActuallyReceipts
                projectNot +=datalist[i].projectNotReceipts

                //总的合计
                this.totalProjectShould += datalist[i].contractMoney
                this.totalProjectAct += datalist[i].projectActuallyReceipts
                this.totalProjectNot += datalist[i].projectNotReceipts
                //项目数量
                datalist[i].projectSum = projectSum
                //应收
                datalist[i].projectShould = parseFloat(projectShould.toFixed(2))
                //实收
                datalist[i].projectAct = parseFloat(projectAct.toFixed(2))
                //未收
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
              this.ContractBusinessList = data.list
              resolve(data.list)
            } else {
              this.ContractBusinessList = []
            }
          })
        })
      },
      // 开始时间改变
      changeStart () {
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          disabledDate: (time) => {
            return time.getTime() > this.dataForm.endDate
          }
        })
        this.pageIndex = 1
        this.getChargeChart()
      },
      // 结束时间改变
      changeEnd () {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate: (time) => {
            return time.getTime() < this.dataForm.startDate
          }
        })
        this.pageIndex = 1
        this.getChargeChart()
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
      },
    }
  }
</script>

<style scoped>
  .tac {
    text-align: center;
  }
  .month_type{
    width: 150px;
  }
  .ccchart_title{
    width: 100%;
    text-align: center;
    margin-top: 5px;
    font-size: 17px;
    font-weight: 700;
  }
  .ccchart_title .ccdate_title{
    margin-top: 4px;
    font-size: 16px;
    font-weight: 500;
  }
  .el-form-item{
    margin-bottom: 2px;
  }
  .f15{
    font-size:15px;
    font-weight: 600;
  }
  .sclall{
    border-top:1px dotted black;margin-top:10px;padding-top:10px;
  }
  table{border:0;border-collapse:collapse}
  .cctable td{padding-bottom:5px;padding-top:5px;border-bottom:1px solid black;border-collapse:collapse}

</style>



