<template>
  <div>
    <van-dialog :title="!dataForm.id ? '新增项目' : '修改项目'" use-slot show-cancel-button v-model="visible"
                @cancel="visible = false" @confirm="dataFormSubmit" :beforeClose="beforeClose">
      <van-form  ref="dataForm">
        <van-field v-model="dataForm.projectProduce" name="projectProduce" label="生产负责人" placeholder="生产负责人"
                   :rules="[{ required: true, message: '请填写生产负责人' }]" readonly @click="producePickerShow = true"/>
        <van-field v-model="dataForm.projectNo" name="projectNo" label="项目编号" placeholder="项目编号"
                   :rules="[{ required: true, message: '请填写项目编号' }]"  disabled/>
        <van-field v-model="dataForm.contractNo" name="contractNo" label="合同编号" placeholder="合同编号"
                   :rules="[{ required: true, message: '请填写项目类型' }]"  disabled/>
        <van-field v-model="dataForm.projectName" name="projectName" label="项目名称" placeholder="项目名称"
                   :rules="[{ required: false, message: '请填写项目名称' }]"/>
        <van-field v-model="dataForm.projectBusiness" name="" label="业务负责人" placeholder="业务负责人" disabled
                   :rules="[{ required: true, message: '请填写业务负责人' }]" disabled/>
        <van-field v-model="dataForm.projectAuthorize" name="projectAuthorize" label="委托单位" placeholder="委托单位"
                   :rules="[{ required: true, message: '请填写委托单位' }]" disabled/>
        <van-field v-model="dataForm.projectNote" name="" label="委托要求" placeholder="委托要求" disabled
                   :rules="[{ required: true, message: '请填写委托要求' }]" disabled/>
        <van-field v-model="dataForm.projectStartDateTime" label="项目启动时间" rule="projectStartDateTime" placeholder="项目启动时间" readonly @click="datePickerShow = true"
                   :rules="[{ required: true, message: '请填写项目启动时间' }]"/>
      </van-form>
    </van-dialog>
    <!-- 日历控件-->
    <van-calendar v-model="datePickerShow" :default-date="dataForm.projectStartDateTime == ''?new Date(): new Date(dataForm.projectStartDateTime)"
                  :min-date="new Date(2010,0,1)" :max-date="new Date(2050,11,31)"
                  @confirm="onDateConfirm" color="#07c160" />
    <!-- 生产负责人 -->
    <van-popup ref="businessId" v-model="producePickerShow" position="bottom" >
      <van-picker show-toolbar
                  title="选择业务负责人" value-key="username"
                  :columns="produceList"
                  @cancel="producePickerShow = false"
                  @confirm="onProduceConfirm"
      /></van-popup>
  </div>
</template>

<script>
  import moment from "moment";

  export default {
    data () {
      return {
        datePickerShow: false,
        producePickerShow: false,
        visible: false,
        dataForm: {
          id: 0,
          projectNo: '',
          contractNo: '',
          projectName: '',
          projectMoney: '',
          projectAuthorize: '',
          projectNote: '',
          projectBusiness: '',
          pStage: '',
          examineNote: '',
          projectType: '',
          projectStage: '',
          projectProduce: '',
          projectProduceAccount: '',
          projectStartDateTime: ''
        },
        produceList: [],
        dataRule: {
          projectNo: [
            { required: true, message: '项目编号不能为空', trigger: 'blur' }
          ],
          contractNo: [
            { required: true, message: '合同编号不能为空', trigger: 'blur' }
          ],
          projectName: [
            { required: true, message: '项目名称不能为空', trigger: 'blur' }
          ],
          projectMoney: [
            { required: true, message: '项目金额不能为空', trigger: 'blur' }
          ],
          projectAuthorize: [
            { required: true, message: '委托单位不能为空', trigger: 'blur' }
          ],
          projectNote: [
            { required: true, message: '项目要求不能为空', trigger: 'blur' }
          ],
          projectBusiness: [
            { required: true, message: '业务负责人不能为空', trigger: 'blur' }
          ],
          projectType: [
            { required: true, message: '项目类型不能为空', trigger: 'blur' }
          ],
          projectStage: [
            { required: true, message: '项目阶段不能为空', trigger: 'blur' }
          ],
          projectProduce: [
            { required: true, message: '生产负责人不能为空', trigger: 'blur' }
          ],
          projectProduceAccount: [
            { required: true, message: '生产负责人账号不能为空', trigger: 'blur' }
          ],
          projectStartDateTime: [
            { required: true, message: '项目启动时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      init (id, item) {
        this.getProduceList()
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetValidation()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/project/project/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.projectNo = data.project.projectNo
                this.dataForm.contractNo = data.project.contractNo
                this.dataForm.projectName = data.project.projectName
                this.dataForm.projectMoney = data.project.projectMoney
                this.dataForm.projectAuthorize = data.project.projectAuthorize
                this.dataForm.projectNote = data.project.projectNote
                this.dataForm.projectBusiness = data.project.projectBusiness
                this.dataForm.examineNote = data.project.examineNote
                this.dataForm.projectType = data.project.projectType
                this.dataForm.projectStage = data.project.projectStage
                this.dataForm.projectProduce = data.project.projectProduce
                this.dataForm.pStage = data.project.pStage
                this.dataForm.projectProduceAccount = data.project.projectProduceAccount
                this.dataForm.projectStartDateTime = data.project.projectStartDateTime
                this.dataForm.projectCreateDateTime = data.project.projectCreateDateTime
                this.dataForm.createuserid = data.project.createuserid
              }
            })
          } else {
            // 新增项目 获取项目号
            this.getProjectNo(item.contractNo)
            this.dataForm.contractNo = item.contractNo
            this.dataForm.projectName = item.contractName
            this.dataForm.projectMoney = item.contractMoney
            this.dataForm.projectAuthorize = item.contractAuthorize
            this.dataForm.projectNote = item.contractNote
            this.dataForm.projectBusiness = item.contractBusiness
            this.dataForm.projectType = item.projectType
            this.dataForm.projectProduceAccount = ''
            this.dataForm.projectProduce = ''
          }
        })
      },
      // 启动时间选择
      onDateConfirm (date) {
        this.dataForm.projectStartDateTime = moment(date).format('YYYY-MM-DD')
        this.datePickerShow = false
      },
      // 生产负责人选择
      onProduceConfirm (item) {
        this.dataForm.projectProduce = item.username
        this.dataForm.projectProduceAccount = item.useraccount
        this.producePickerShow = false
      },
      // 窗口关闭前的动作
      beforeClose (action, done) {
        console.log(this.visible)
        done(!this.visible)
      },
      // 表单提交
      dataFormSubmit () {
        // 项目负责人
        console.log(this.dataForm.projectProduceAccount)
        this.$refs['dataForm'].validateAll().then(success => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'projectNo': this.dataForm.projectNo,
              'contractNo': this.dataForm.contractNo,
              'projectName': this.dataForm.projectName,
              'projectMoney': this.dataForm.projectMoney,
              'projectAuthorize': this.dataForm.projectAuthorize,
              'projectNote': this.dataForm.projectNote,
              'projectBusiness': this.dataForm.projectBusiness,
              'pStage': this.dataForm.pStage,
              'examineNote': this.dataForm.examineNote,
              'projectType': this.dataForm.projectType,
              'projectStage': this.dataForm.projectStage,
              'projectProduce': this.dataForm.projectProduce,
              'projectProduceAccount': this.dataForm.projectProduceAccount,
              'projectStartDateTime': this.dataForm.projectStartDateTime,
              'createuserid': this.dataForm.createuserid
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 添加项目 获取项目编号
      getProjectNo (contractNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/getProjectNo`),
            method: 'get',
            params: this.$http.adornParams({ 'contractNo': contractNo })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.projectNo = data.projectNo
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取生产负责人列表
      getProduceList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/getProduceList`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.produceList = data.list
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
