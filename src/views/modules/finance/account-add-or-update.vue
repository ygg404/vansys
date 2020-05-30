<template>

  <van-dialog :title="!dataForm.id ? '新增' : '修改'" use-slot show-cancel-button v-model="visible"
              @cancel="visible = false" @confirm="dataFormSubmit" :beforeClose="beforeClose">
    <van-form  ref="dataForm">
      <van-field v-model="dataForm.contractNo" name="contractNo" label="合同编号" placeholder="合同编号" disabled/>
      <van-field v-model="dataForm.accountNote" name="accountNote" label="收支内容" placeholder="收支内容"
                 :rules="[{ required: true, message: '请填写收支内容' }]"/>
      <van-field v-model="dataForm.accountNum" name="accountNum" label="收支金额" placeholder="收支金额"
                 :rules="[{ required: true, message: '请填写收支金额' }]" type="number"/>
      <van-field v-model="dataForm.accountType" name="accountType" label="支出类型" placeholder="支出类型"
                 :rules="[{ required: false, message: '请填写支出类型' }]"/>
      <van-field v-model="dataForm.accountTypeName" name="accountTypeName" label="支出类型名称" placeholder="支出类型名称"/>
      <van-field v-model="dataForm.accountAddDateTime" label="项目启动时间" rule="accountAddDateTime" placeholder="项目启动时间" readonly @click="datePickerShow = true"
                 :rules="[{ required: true, message: '请选择项目启动时间' }]"/>
      <van-field v-model="dataForm.createDateTime" label="创建时间" rule="createDateTime" placeholder="创建时间" readonly @click="datePickerShow = true"
                 :rules="[{ required: true, message: '请选择创建时间' }]"/>
    </van-form>
  </van-dialog>

</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          contractNo: '',
          accountNote: '',
          accountNum: '',
          accountType: '',
          accountTypeName: '',
          accountAddDateTime: '',
          createDateTime: ''
        },
        dataRule: {
          contractNo: [
            { required: true, message: '合同编号不能为空', trigger: 'blur' }
          ],
          accountNote: [
            { required: true, message: '收支内容不能为空', trigger: 'blur' }
          ],
          accountNum: [
            { required: true, message: '收支金额不能为空', trigger: 'blur' }
          ],
          accountType: [
            { required: true, message: '支出类型不能为空', trigger: 'blur' }
          ],
          accountTypeName: [
            { required: true, message: '支出类型名称不能为空', trigger: 'blur' }
          ],
          accountAddDateTime: [
            { required: true, message: '账号收支添加时间不能为空', trigger: 'blur' }
          ],
          createDateTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/finance/account/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.contractNo = data.projectaccount.contractNo
                this.dataForm.accountNote = data.projectaccount.accountNote
                this.dataForm.accountNum = data.projectaccount.accountNum
                this.dataForm.accountType = data.projectaccount.accountType
                this.dataForm.accountTypeName = data.projectaccount.accountTypeName
                this.dataForm.accountAddDateTime = data.projectaccount.accountAddDateTime
                this.dataForm.createDateTime = data.projectaccount.createDateTime
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/finance/account/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'contractNo': this.dataForm.contractNo,
                'accountNote': this.dataForm.accountNote,
                'accountNum': this.dataForm.accountNum,
                'accountType': this.dataForm.accountType,
                'accountTypeName': this.dataForm.accountTypeName,
                'accountAddDateTime': this.dataForm.accountAddDateTime,
                'createDateTime': this.dataForm.createDateTime
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
          }
        })
      }
    }
  }
</script>
