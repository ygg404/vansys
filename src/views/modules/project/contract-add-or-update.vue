<template>
  <div>
    <van-dialog :title="!dataForm.id ? '新增合同' : '修改合同'" use-slot show-cancel-button v-model="visible"
                @cancel="visible = false" @confirm="dataFormSubmit" :beforeClose="beforeClose">
      <div :style="'max-height: ' + (documentClientHeight - 200).toString() + 'px'" style="overflow-y: auto;">
        <van-form  ref="dataForm" >
          <van-field v-model="dataForm.contractNo" name="contractNo" label="合同编号" disabled
                     :rules="[{ required: true, message: '请填写合同编号' }]" />
          <van-field v-model="dataForm.contractName" name="contractName" label="合同名称"
                     :rules="[{ required: true, message: '请填写合同名称' }]" />
          <van-field v-model="dataForm.projectType" name="projectType" label="项目类型" readonly @click="typePickerShow = true" autosize type="textarea"
                     :rules="[{ required: true, message: '请填写项目类型' }]" />
          <van-field v-model="dataForm.contractMoney" name="contractMoney" type="number" label="合同金额"
                     :rules="[{ required: false, message: '请填写合同金额' }]"/>
          <van-field v-model="dataForm.contractType" label="合同类型">
            <template slot="input">
              <input type="radio"  v-model="dataForm.contractType" id="s1" value="0"  style="zoom:2;width:9px;"/>合同委托
              <input type="radio"  v-model="dataForm.contractType" id="s2" value="1"  style="zoom:2;margin-left: 3px;width:9px;"/>一般合同
            </template>
          </van-field>

          <van-field v-model="dataForm.contractAuthorize" name="contractAuthorize" label="委托单位" placeholder="委托单位"
                     :rules="[{ required: true, message: '请填写委托单位' }]" />
          <van-field v-model="dataForm.contractNote" name="" label="委托要求" placeholder="委托要求"
                     :rules="[{ required: true, message: '请填写委托要求' }]" />
          <van-field v-model="dataForm.userName" name="userName" label="联系人名称" placeholder="联系人名称"/>
          <van-field v-model="dataForm.userPhone" name="userPhone" label="联系人电话" placeholder="联系人电话"/>
          <van-field v-model="dataForm.contractBusiness" name="contractBusiness" label="业务负责人" placeholder="业务负责人" readonly @click="busPickerShow = true"
                     :rules="[{ required: true, message: '请填写业务负责人' }]"/>
          <van-field v-model="dataForm.contractAddTime" label="签订时间" rule="contractAddTime" placeholder="合同签订时间" readonly @click="datePickerShow = true"
                     :rules="[{ required: true, message: '请填写签订时间' }]"/>
        </van-form>
        <!-- 上传文件控件-->
        <div class="folder_style" v-loading="loading">
          <van-uploader accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlxs,image/*" :after-read="afterReadHandle" >
            <van-button  icon="photo" type="primary" size="small">上传文件</van-button>
          </van-uploader>
          <span class="folder_span" >{{dataForm.filename}}
          <van-icon size="large" v-if="dataForm.filename != ''" name="clear" @click="dataForm.filename = '' "></van-icon>
        </span>
        </div>
      </div>
    </van-dialog>

    <!-- 日历控件-->
    <van-calendar v-model="datePickerShow" :default-date="dataForm.contractAddTime == ''?new Date(): new Date(dataForm.contractAddTime)"
                  :min-date="new Date(2010,0,1)" :max-date="new Date(2050,11,31)"
                  @confirm="onDateConfirm" color="#1989fa" />
    <!-- 业务员选择 -->
    <van-popup ref="businessId" v-model="busPickerShow" position="bottom" >
      <van-picker show-toolbar title="选择业务负责人" value-key="username" :columns="businessList" @cancel="busPickerShow = false" @confirm="onBusinessConfirm"/>
    </van-popup>
    <!-- 选择项目类型 -->
    <van-dialog v-model="typePickerShow" style="width: 85%" title="选择项目类型" show-cancel-button @confirm="confirmPTI" @cancel="typePickerShow = false">
      <van-checkbox-group v-model="dataForm.projectTypeIdList" ref="checkboxGroup">
        <van-checkbox v-for="item in projectTypeList" :key="item.id" :name="item.id" style="padding: 5px;" shape>
          {{item.name}}
        </van-checkbox>
      </van-checkbox-group>
    </van-dialog>


  </div>
</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'
  import {isMobile} from '../../../utils/validate'
  import {isPhone} from '../../../utils/validate'

  export default {
    data () {
      let checkPhone = (rule, value, callback) => {
        if (!value) {
          callback()
        } else {
          if (isMobile(value) || isPhone(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        }
      }
      return {
        loading: false,
        typePickerShow: false,
        datePickerShow: false,
        busPickerShow: false,
        visible: false,
        dataForm: {
          id: 0,
          contractNo: '',
          contractAddTime: '',
          contractCreateTime: '',
          contractAuthorize: '',
          contractName: '',
          contractType: '',
          contractNote: '',
          contractBusiness: '',
          contractBusinessId: '',
          contractStage: '',
          contractMoney: '',
          projectType: '',
          filename: '',
          userPhone: '',
          userName: '',
          projectTypeIdList: []
        },
        businessList: [], // 业务员列表
        projectTypeList: [], // 项目类型列表
        upContractUrl: window.SITE_CONFIG['baseUrl'] + '/project/contract/upContractFile/',  // 合同上传地址
        tokenHeaders: { token: Vue.cookie.get('token') },  // token请求
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
    },
    created () {
      // this.dataForm.contractType = 0
      this.getProjectTypeList().then()
      this.getBusinessList()
    },
    methods: {
      // 窗口关闭前的动作
      beforeClose (action, done) {
        console.log(this.visible)
        done(!this.visible)
      },
      // 签订时间选择
      onDateConfirm (date) {
        this.dataForm.contractAddTime = moment(date).format('YYYY-MM-DD')
        this.datePickerShow = false
      },
      // 业务负责人选择
      onBusinessConfirm (item) {
        this.dataForm.contractBusiness = item.username
        this.busPickerShow = false
      },
      //
      confirmPTI(){
        for(let itemA of this.dataForm.projectTypeIdList){
          for(let itemB of this.projectTypeList){
            if(itemA === itemB.id){
              this.dataForm.projectType += itemB.name + ' '
            }
          }
        }
        this.typePickerShow = false
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/project/contract/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.contractNo = data.projectContract.contractNo
                this.dataForm.contractAddTime = data.projectContract.contractAddTime
                this.dataForm.contractCreateTime = data.projectContract.contractCreateTime
                this.dataForm.contractAuthorize = data.projectContract.contractAuthorize
                this.dataForm.contractName = data.projectContract.contractName
                this.dataForm.contractType = data.projectContract.contractType
                this.dataForm.contractNote = data.projectContract.contractNote
                this.dataForm.contractBusiness = data.projectContract.contractBusiness
                this.dataForm.contractStage = data.projectContract.contractStage
                this.dataForm.contractMoney = data.projectContract.contractMoney
                this.dataForm.projectType = data.projectContract.projectType
                this.dataForm.filename = data.projectContract.filename
                this.dataForm.userPhone = data.projectContract.userPhone
                this.dataForm.userName = data.projectContract.userName
                this.dataForm.projectTypeIdList = []
                for (let ptypeName of data.projectContract.projectType.split(',')) {
                  for (let ptype of this.projectTypeList) {
                    if (ptype.name === ptypeName) this.dataForm.projectTypeIdList.push(ptype.id)
                  }
                }
                for (let bus of this.businessList) {
                  if (this.dataForm.contractBusiness === bus.username) this.dataForm.contractBusinessId = bus.userId
                }
                console.log(this.dataForm.contractBusinessId)
              }
            })
          } else {
            this.dataForm.contractAddTime = ''
            this.dataForm.contractAuthorize = ''
            this.dataForm.contractName = ''
            this.dataForm.contractType = 0
            this.dataForm.contractNote = ''
            this.dataForm.contractBusiness = ''
            this.dataForm.contractStage = ''
            this.dataForm.contractMoney = 0
            this.dataForm.projectType = ''
            this.dataForm.filename = ''
            this.dataForm.userPhone = ''
            this.dataForm.userName = ''
            this.dataForm.projectTypeIdList = []
            this.dataForm.contractBusinessId = ''
            this.getMaxcontractNo()
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs.dataForm.validateAll().then(
          success => {
            console.log(this.dataForm.projectTypeIdList)
            // 项目类型
            this.dataForm.projectType = ''
            for (let ptypeId of this.dataForm.projectTypeIdList) {
              for (let ptype of this.projectTypeList) {
                if (ptypeId === ptype.id) { this.dataForm.projectType += (ptype.name + ',') }
              }
            }
            // 业务负责人
            for (let bus of this.businessList) {
              if (this.dataForm.contractBusinessId === bus.userId) this.dataForm.contractBusiness = bus.username
            }
            let len = this.dataForm.projectType.length
            this.dataForm.projectType = len > 0 ? this.dataForm.projectType.substring(0, len - 1) : ''
            this.$nextTick(() => {
              this.$refs['dataForm'].resetValidation()
              this.$http({
                url: this.$http.adornUrl(`/project/contract/${!this.dataForm.id ? 'save' : 'update'}`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id || undefined,
                  'contractNo': this.dataForm.contractNo,
                  'contractAddTime': this.dataForm.contractAddTime,
                  'contractAuthorize': this.dataForm.contractAuthorize,
                  'contractName': this.dataForm.contractName,
                  'contractType': this.dataForm.contractType,
                  'contractNote': this.dataForm.contractNote,
                  'contractBusiness': this.dataForm.contractBusiness,
                  'contractStage': this.dataForm.contractStage,
                  'contractMoney': this.dataForm.contractMoney,
                  'projectType': this.dataForm.projectType,
                  'filename': this.dataForm.filename,
                  'userPhone': this.dataForm.userPhone,
                  'userName': this.dataForm.userName
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$notify({ type: 'success', message: '操作成功'})
                  this.visible = false
                  this.$emit('refreshDataList')
                } else {
                  this.$notify({message: data.msg, type: 'danger'})
                }
              })
            })
          }
        )
      },
      // 新增合同获取合同编号
      getMaxcontractNo () {
        this.$http({
          url: this.$http.adornUrl(`/project/contract/getMaxContractNo`),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.contractNo = data.contractNo
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 获取业务员列表
      getBusinessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/contract/getBusinessList`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.businessList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取项目类型列表
      getProjectTypeList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/projecttype/getProjectTypelist`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectTypeList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 上传文件
      afterReadHandle (file) {
        console.log(file)
        this.loading = true
        let size = file.file.size / 1024 / 1024
        if (size > 10) {
          this.$notify({type: 'danger', message: '文件必须小于10M'})
          return
        }
        let param = new FormData()
        param.append('contractNo', this.dataForm.contractNo)
        param.append('file', file.file)
        this.$http({
          url: this.$http.adornUrl(`/project/contract/upContractFile/`),
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: param
        }).then(({data}) => {
          this.loading = false
          if (data && data.code === 0) {
            this.dataForm.filename = data.fileName
            this.$notify({ type: 'success' , message: '上传成功！'})
          } else {
            this.$notify({ type: 'danger' , message: data.msg })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .folder_style{
    padding: 5px;
    display: flex;
    justify-content: left;
  }
  .folder_style button{
    min-width: 84px;
  }
  .folder_style .folder_span{
    font-size: 9pt;
    color: #3b97d7;
  }
  .van-cell{
    padding:5px 5px;
  }

</style>
