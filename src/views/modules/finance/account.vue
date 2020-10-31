<template>
  <div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getFinance()" >
      <div style="width:95%;margin:0 auto;">
        <el-form-item style="margin-bottom:5px;margin-top:10px;">
          <el-date-picker style="float:left;width:45%;" v-model="dataForm.startDate" type="date"  placeholder="开始日期"  :picker-options="pickerOptionsStart" @change="changeEnd"></el-date-picker>
          <div style="float:left;width:10%;text-align: center;">至</div>
          <el-date-picker style="float:left;width:45%;" v-model="dataForm.endDate" type="date"  placeholder="结束日期"  :picker-options="pickerOptionsEnd" @change="changeStart"></el-date-picker>
        </el-form-item>
      </div>
      <div style="width:95%;margin:0 auto;">
        <el-form-item>
          <el-select v-model="dataForm.projectType" placeholder="类型选择" clearable style="width: 150px;"
                     @change="getFinance">
            <el-option v-for="item in workGroupList" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:120px;">
          <el-input v-model="dataForm.contractname" placeholder="合同关键字" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getFinance()">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!--标题-->
    <div class="chart_title" style="padding-bottom:10px;">
      <div style="padding-bottom:2px;">财务操作</div>
      <div class="date_title">{{dateTitle}}</div>
    </div>

    <!--列表数据-->
    <div :style="'max-height: ' + (documentClientHeight - 300).toString() + 'px'" class="os">
      <div :key="item + index" v-for="(item,index) in dataList" class="ls">
        <van-row style="padding-bottom:3px;">
          <van-col span="5" class="tac">{{item.contractNo}}</van-col>
          <van-col span="10">{{item.contractName}}</van-col>
          <van-col span="9">{{item.contractAuthorize}}</van-col>
        </van-row>
        <van-row type="flex" justify="space-around" >
          <van-col span="9" class="tac" style="font-size:15px;">{{item.contractBusiness}}</van-col>
          <van-col span="15" class="tac" style="font-size:15px;">{{item.contractAddTime}}</van-col>
        </van-row>
        <van-row type="flex" align="center" justify="space-around" style="padding-bottom:2px;">
          <van-col span="5" class="tac" style="font-size:15px;">{{item.contractMoney}}</van-col>
          <van-col span="5" class="tac" style="font-size:15px;">{{item.projectActuallyReceipts}}</van-col>
          <van-col span="5" class="tac" style="font-size:15px;">{{item.projectNotReceipts}}</van-col>
          <van-col span="5" class="tac" style="font-size:15px;">{{item.projectExpenditure}}</van-col>
          <van-col span="4" class="tac" style="font-size:15px;"><button class="oper_btn" @click="addOrUpdateHandle(item.contractNo)">操作</button></van-col>
        </van-row>
      </div>
    </div>
    <!--分页控件-->
    <div style="margin-top:5px;padding-top:5px;border-top:1px solid rgb(213, 226, 239);">
      <van-pagination v-model="pageIndex" :total-items="totalPage" items-per-page="25" mode="simple" @change="getFinance"/>
    </div>

    <edit-account v-if="visible" ref="ShowAccount" @refreshDataList="getFinance"></edit-account>
  </div>
</template>

<script>
  import moment from 'moment'
  import EditAccount from './edit-account'

  export default {
    data () {
      return {
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        dataForm: {
          // 关键字搜索 这里定为合同名称
          key: '',
          // 业务负责人
          business: '',
          // 类型选择
          projectType: '',
          startDate: '',
          endDate: '',
          order: 'desc',
          sidx: 'id'
        },
        monthTitle: '', // 月份标题
        // 业务负责人列表
        workGroupList: [],
        dataList: [],
        totalProjectSum: 0,  // 项目合计数
        totalProjectShould: 0, // 统计实收
        totalProjectAct: 0, // 统计实收
        totalProjectNot: 0, // 统计未收
        dataListLoading: false,
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        visible: false
      }
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    components: {
      EditAccount
    },

    created () {
      this.dataForm.startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      this.changeEnd()
      this.dataForm.endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      this.changeStart()
      // 类型选择选项
      this.getworkGroupListFromApi()
      this.getFinance()
    },
    methods: {
      // 获取数据列表
      getFinance () {
        this.dateTitle = (this.dataForm.startDate === null ? '' : moment(this.dataForm.startDate).format('YYYY-MM-DD')) + '至' + (this.dataForm.endDate === '' ? '今' : moment(this.dataForm.endDate).format('YYYY-MM-DD'))
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/finance/account/getFinanceOperationPage'),
          method: 'get',
          params: this.$http.adornParams({
            'projectType': this.dataForm.projectType,
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.contractname,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order,
            'business': this.dataForm.business,
            'startDate': this.dataForm.startDate,
            'endDate': this.dataForm.endDate
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },

      // 编辑财务操作
      addOrUpdateHandle (contractNo) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.ShowAccount.init(contractNo)
        })
      },

      // 排序字段改变
      changeSort (val) {
        console.log(val)
        switch (val.order) {
          case 'ascending':
            this.dataForm.order = 'asc'
            break
          case 'descending':
            this.dataForm.order = 'desc'
            break
          default:
            this.dataForm.order = 'desc'
        }
        // this.dataForm.sidx = val.prop
        this.getFinance()
      },

      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getFinance()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getFinance()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },

      // 从后台获得类型选择数据列表内容  填充至选项
      getworkGroupListFromApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/projecttype/getProjectTypelist'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workGroupList = data.list
              resolve(data.list)
            } else {
              this.workGroupList = []
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
        this.getFinance()
      },
      // 结束时间改变
      changeEnd () {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate: (time) => {
            return time.getTime() < this.dataForm.startDate
          }
        })
        this.pageIndex = 1
        this.getFinance()
      }
    }
  }
</script>

<style lang="less">
  .month_type {
    width: 150px;
  }
  .el-form--inline .el-form-item{
    margin-right:0px;
  }

  .chart_title {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    font-size: 17px;
    font-weight: 600;
  }

  .chart_title .date_title {
    margin-top: 4px;
    font-size: 17px;
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

  .table_class .table_row .grid-header {
    font-weight: 700;
    font-size: 16px;
    color: rgba(15, 17, 23, 0.78);
  }

  .table_class .table_row .group-header {
    font-weight: 700;
    font-size: 15px;
  }
  .el-form-item{
    margin-bottom: 2px;
  }
.tac{
  text-align:center;
}
  .oper_btn{
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 30px;
    margin: 0;
    line-height: 30px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    -webkit-transition: opacity .2s;
    transition: opacity .2s;
    -webkit-appearance: none;
    -webkit-text-size-adjust: 100%;
    background-color: #fff;
    border: 1px solid #ebedf0;
    padding:0 10px;
    font-size:12px;
    color: @stylecolor;
    border-color: @stylecolor;
  }
  .os {
    overflow: scroll;
  }
  .ls{
    width:98%;margin:0 auto;border-top:1px dotted rgb(195, 197, 199);padding-top:3px;padding-bottom:3px;
  }
</style>



