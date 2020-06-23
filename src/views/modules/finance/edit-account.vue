<template>
  <div>
    <van-dialog width="95%" v-model="visible"
                :beforeClose="beforeClose" show-cancel-button cancelButtonText="返回"
                @cancel="visible = false" cancelButtonColor="red" :show-confirm-button="noshowconfirmbtnflag">
      <template slot="title">
        <div style="font-size:17px;font-weight:600;">财务操作</div>
      </template>
      <!---->
      <van-collapse v-model="panelShow"  class="coll" style="width:95%;margin:0 auto;">
        <van-collapse-item  name="1" class="Infocollapse">
          <template slot="title">
            <div style="font-size:16px;font-weight:600;">合同基本信息</div>
          </template>
          <van-row class="mt4">
            <van-col span="7" class="tac">合同编码:</van-col>
            <van-col span="17" class="talpl10">{{ContractInfo.contractNo}}</van-col>
          </van-row>
          <van-row class="mt4">
            <van-col span="7" class="tac">合同名称:</van-col>
            <van-col span="17" class="talpl10">{{ContractInfo.contractName}}</van-col>
          </van-row>
          <van-row class="mt4">
            <van-col span="7" class="tac">合同金额:</van-col>
            <van-col span="17" class="talpl10">{{ContractInfo.contractMoney}}</van-col>
          </van-row>
          <van-row class="mt4">
            <van-col span="7" class="tac">合同类型:</van-col>
            <van-col span="17" class="talpl10">{{contracttypeName}}</van-col>
          </van-row>
          <van-row class="mt4">
            <van-col span="7" class="tac">合同委托单位:</van-col>
            <van-col span="17" class="talpl10">{{ContractInfo.contractAuthorize}}</van-col>
          </van-row>
          <van-row class="mt4">
            <van-col span="7" class="tac">业务负责人:</van-col>
            <van-col span="17" class="talpl10">{{ContractInfo.contractBusiness}}</van-col>
          </van-row>
          <van-row class="mt4">
            <van-col span="7" class="tac">联系人:</van-col>
            <van-col span="17" class="talpl10">{{ContractInfo.userName}}</van-col>
          </van-row>
          <van-row class="mt4">
            <van-col span="7" class="tac">联系电话:</van-col>
            <van-col span="17" class="talpl10">{{ContractInfo.userPhone}}</van-col>
          </van-row>
          <van-row class="mt4">
            <van-col span="7" class="tac">合同签订时间:</van-col>
            <van-col span="17" class="talpl10">{{ContractInfo.contractAddTime}}</van-col>
          </van-row>
        </van-collapse-item>
      </van-collapse>

      <!---->
      <van-collapse v-model="paneEIShow"  style="width:95%;margin:0 auto;" class="coll">
        <van-collapse-item  name="1" class="InfoTitle">
          <template slot="title">
            <div style="font-size:16px;font-weight:600;">收支信息</div>
          </template>
          <van-row>
            <van-col span="6" class="tac">项目应收:</van-col>
            <van-col span="6" class="tac">未收款项:</van-col>
            <van-col span="6" class="tac">已收款项:</van-col>
            <van-col span="6" class="tac">支出款项:</van-col>
          </van-row>
          <van-row>
            <van-col span="6" class="tac">{{settlementmoney.Receivable}}</van-col>
            <van-col span="6" class="tac">{{settlementmoney.NotReceipts}}</van-col>
            <van-col span="6" class="tac">{{settlementmoney.ActuallyReceipts}}</van-col>
            <van-col span="6" class="tac">{{settlementmoney.Expenditure}}</van-col>
          </van-row>
        </van-collapse-item>
      </van-collapse>

      <!---->
      <van-row style="padding-top:5px;padding-bottom:5px;">
        <van-col span="5" class="tac">日期</van-col>
        <van-col span="3" class="tac">收支</van-col>
        <van-col span="7" class="tac">金额</van-col>
        <van-col span="5" class="tac">备注</van-col>
        <van-col span="4" class="tac">操作</van-col>
      </van-row>

      <!---->
      <div class="os" style="max-height:170px;">
        <div :key="item + index" v-for="(item,index) in AccountList">
          <van-row type="flex" align="center" style="margin-bottom:5px;">
            <van-col span="5" class="tac eifs">{{item.accountAddDateTime}}</van-col>
            <van-col span="3" class="tac eifs">{{item.accountTypeName}}</van-col>
            <van-col span="7" class="tac eifs">{{item.accountNum}}</van-col>
            <van-col span="5" class="tac eifs">{{item.accountNote}}</van-col>
            <van-col span="4" class="tac"><button @click="DeleteOneAccount(item.id)" class="btn">删除</button></van-col>
          </van-row>
        </div>
      </div>

      <!---->
      <button class="confirmbtn" style="float:right;" @click="AddAcountInfoHandle">新增</button>
    </van-dialog>

    <!-- 添加收支数据 对话框 待测试-->
    <van-dialog v-model="AccountaddVisible"  show-cancel-button
                :beforeClose="beforeCloseAccountAdd"
                @confirm ="dataFormSubmit" @cancel="AccountaddVisible = false">
      <template slot="title">
        <div style="font-size:17px;font-weight:600;">添加收支数据</div>
      </template>
      <van-form  ref="dataForm">
        <van-field v-model="dataForm.accountNum" name="accountNum" type="number" label="金额" placeholder="金额"
                   :rules="[{ required: false, message: '请填写金额' }]"/>
        <van-field v-model="dataForm.accountType"  name="contractType" label="支出类型" :rules="[{ required: true, message: '请选择支出类型' }]" >
          <template slot="input">
            <input type="radio" v-model="dataForm.accountType" id="s1" value="0"  style="zoom:2;width:9px;"/>收款
            <input type="radio" v-model="dataForm.accountType" id="s2" value="1"  style="zoom:2;margin-left: 3px;width:9px;"/>支出
          </template>
        </van-field>
        <van-field v-model="dataForm.accountNote" name="accountNote"  label="备注" placeholder="备注"/>
        <van-field v-model="dataForm.accountAddDateTime" label="时间" rule="accountAddDateTime" placeholder="时间" readonly @click="datePickerShow = true"
                   :rules="[{ required: true, message: '请选择时间' }]"/>
      </van-form>
    </van-dialog>
    <!---->
    <van-calendar v-model="datePickerShow" :default-date="dataForm.accountAddDateTime == ''?new Date(): new Date(dataForm.accountAddDateTime)"
                  :min-date="new Date(2010,0,1)" :max-date="new Date(2050,11,31)"
                  @confirm="onDateConfirm" color="#1989fa"></van-calendar>
  </div>
</template>

<
<script>
  import moment from 'moment'
  export default {
    data: () => ({
      // 表单
      dataForm: {
        // 合同编号
        // contractNo:'',
        accountNum: '',
        accountType: '',
        accountNote: '',
        accountAddDateTime: ''
      },
      // 日历控件
      datePickerShow: false,
      // 折叠面板
      panelShow: ['1'],
      paneEIShow: ['1'],
      noshowconfirmbtnflag: false,
      // 当前对话框
      visible: false,
      ProjectInfoPanel: [false],
      accountPanel: [true],
      addAccountDialog: false,
      dateMenu: false,
      chooseType: '0',
      accountMoney: 0,
      accountNote: '',
      accountType: '',
      startDateTime: new Date().toISOString().substr(0, 10),
      projectNo: '',
      projectNot: 0,
      projectGet: 0,
      projectOut: 0,

      // 新建对话框 弹窗
      AccountaddVisible: false,
      // 给添加财务操作使用的
      OpercontractNo: '',
      // 项目信息
      ContractInfo: {
        contractAddTime: '',
        contractAuthorize: '',
        contractBusiness: '',
        contractCreateTime: '',
        contractMoney: '',
        contractName: '',
        contractNo: '',
        contractNote: '',
        contractStage: '',
        contractType: '',
        userName: '',
        userPhone: ''
      },

      // 将标识符转换成 文字信息
      // 合同类型: 0.合同委托 1.一般委托
      contracttypeName: '',
      // 合同状态: 1.正常2.回收站
      contractstageName: '',

      // 结算信息
      settlementmoney: {
        Receivable: '',
        ActuallyReceipts: '',
        NotReceipts: '',
        Expenditure: ''
      },
      AccountList: [],
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 25,
      totalPage: 0,
      snackbar: false,
      snackbarColor: '',
      snackbarText: '',
      snackbarTimeout: 2000
    }),
    methods: {
      beforeCloseAccountAdd (action, done) {
        done(!this.AccountaddVisible)
      },
      // 启动时间选择
      onDateConfirm (date) {
        this.dataForm.accountAddDateTime = moment(date).format('YYYY-MM-DD')
        this.datePickerShow = false
      },
      // 初始化
      init (contractNo) {
        this.visible = true
        // 1.获得合同编号对应的项目信息
        this.getContractInfoByContractNo(contractNo)
        // 2 .获得合同编号对应的财务操作 数据
        this.getAccountListByContractNo(contractNo)
        // 3 . 获取 项目应收 未收款项 已收款项 支出款项
        this.getSettlementMoneyByContractNo(contractNo)
        // 设置 对话框的合同编号
        this.OpercontractNo = contractNo
      },

      // 财务操作列表
      getAccountListByContractNo (contractNo) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/finance/account/GetAccountListByContract/` + contractNo),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.AccountList = data.page.list
          } else {
          }
          this.dataListLoading = false
        })
      },

      // 合同编号对应的合同信息
      getContractInfoByContractNo (contractNo) {
        this.dataListLoading = true
        this.$http({
          // 这里错了
          url: this.$http.adornUrl(`/finance/account/getContractByContractNo/` + contractNo),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.ContractInfo.contractAddTime = data.ContractInfo.contractAddTime
            this.ContractInfo.contractAuthorize = data.ContractInfo.contractAuthorize
            this.ContractInfo.contractBusiness = data.ContractInfo.contractBusiness
            this.ContractInfo.contractCreateTime = data.ContractInfo.contractCreateTime
            this.ContractInfo.contractMoney = data.ContractInfo.contractMoney
            this.ContractInfo.contractName = data.ContractInfo.contractName
            this.ContractInfo.contractNo = data.ContractInfo.contractNo
            this.ContractInfo.contractNote = data.ContractInfo.contractNote
            this.ContractInfo.contractStage = data.ContractInfo.contractStage
            this.ContractInfo.contractType = data.ContractInfo.contractType
            this.ContractInfo.userName = data.ContractInfo.userName
            this.ContractInfo.userPhone = data.ContractInfo.userPhone
            if (this.ContractInfo.contractStage === 0) {
              this.contractstageName = '正常'
            }
            if (this.ContractInfo.contractStage === 1) {
              this.contractstageName = '回收站'
            }
            if (this.ContractInfo.contractType === 0) {
              this.contracttypeName = '合同委托'
            }
            if (this.ContractInfo.contractType === 1) {
              this.contracttypeName = '一般委托'
            }
          } else {

          }
          this.dataListLoading = false
        })
      },

      // 通过合同编号获得相应的结算
      getSettlementMoneyByContractNo (contractNo) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/finance/account/GetSettlementMoneyByContractNo/` + contractNo),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.settlementmoney.Receivable = data.settlementMoneyVoEntity.receivable
            this.settlementmoney.ActuallyReceipts = data.settlementMoneyVoEntity.actuallyReceipts
            this.settlementmoney.NotReceipts = data.settlementMoneyVoEntity.notReceipts
            this.settlementmoney.Expenditure = data.settlementMoneyVoEntity.expenditure
          } else {

          }
          this.dataListLoading = false
        })
      },

// 返回按钮点击事件
      CloseThisDialog () {
        this.$emit('refreshDataList')
        this.visible = false
      },

// 新增按钮点击事件
      AddAcountInfoHandle () {
        this.AccountaddVisible = true
        this.dataForm.accountAddDateTime = moment(new Date()).format('YYYY-MM-DD')
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
        this.dataForm.sidx = val.prop
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validateAll().then(success => {
          console.log(this.dataForm.accountAddDateTime)
          this.$http({
            url: this.$http.adornUrl(`/finance/account/save`),
            method: 'post',
            data: this.$http.adornData({
              'contractNo': this.OpercontractNo,
              'accountNote': this.dataForm.accountNote,
              'accountNum': this.dataForm.accountNum,
              'accountType': this.dataForm.accountType,
              'accountAddDateTime': this.dataForm.accountAddDateTime
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
            } else {
              this.$message.error(data.msg)
            }
            this.dataForm.accountNote = null
            this.dataForm.accountNum = null
            this.dataForm.accountType = null
            this.dataForm.accountAddDateTime = null
            this.AccountaddVisible = false
            this.getContractInfoByContractNo(this.OpercontractNo)
            this.getAccountListByContractNo(this.OpercontractNo)
            this.getSettlementMoneyByContractNo(this.OpercontractNo)
          })
        })
      },

      // 删除
      DeleteOneAccount (id) {
        let tip = '此操作将永久删除编号为[' + id + ']的财务操作记录, 是否继续?'
        this.$dialog.confirm({
          title: '标题',
          message: tip
        })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl('/finance/account/delete'),
              method: 'post',
              data: this.$http.adornData({
                'id': id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$notify({message: '操作成功', type: 'success'})
                //
                this.getContractInfoByContractNo(this.OpercontractNo)
                // 2 .获得合同编号对应的财务操作 数据
                this.getAccountListByContractNo(this.OpercontractNo)
                // 3 . 获取 项目应收 未收款项 已收款项 支出款项
                this.getSettlementMoneyByContractNo(this.OpercontractNo)
              } else {
                this.$notify({message: data.msg, type: 'danger'})
              }
            })
          })
          .catch(() => {

          })
      },
      // 窗口关闭前的动作
      beforeClose (action, done) {
        console.log(this.visible)
        done(!this.visible)
      }
    },
    mounted () {
      // this.getProjectsFromApi().then(success=>{}).catch(error=>{})
    }

  }
</script>

<style>
  .bottom_btn {
    margin: 20px;
    width: 100%;
    text-align: center;
  }
  .tac{
    text-align: center;
  }
  .talpl10{
    text-align:left;padding-left:10px;
  }
  .mt4{
    margin-top:4px;
  }
  .eifs{
    font-size:14px;
    color: #969799;
  }
  .btn{
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
    background-color: #F56C6C;
    border: 1px solid #ebedf0;
    padding:0 10px;
    font-size:12px;
  }
  .f14{
    font-size:15px;
  }
  .confirmbtn {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    overflow: visible;
    text-transform: none;
    font: inherit;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: 16px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    transition: opacity .2s;
    -webkit-appearance: none;
    color: #1989fa;
    background-color: #fff;
    width: 50%;
    height: 50px;
    line-height: 48px;
    border: 0;
  }
  .os {
    overflow: scroll;
  }
  .coll .van-collapse-item__content{
    padding:2px 10px;
  }
  .van-dialog__header{
    padding-top:20px;
  }

  .coll .van-cell{
    padding: 3px 16px;
  }

</style>


