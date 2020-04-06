<template>
  <van-dialog title="修改密码" use-slot show-cancel-button v-model="visible"
              @cancel="visible = false" @confirm="dataFormSubmit" :beforeClose="beforeClose">
    <vantForm ref="dataForm" :rules="dataRule" inputVail="true" >
      <template slot="items" >
        <van-field label="账号:" v-model="userAccount" readonly />
        <van-field label="姓名:" v-model="userName" readonly />
        <van-field error-message="原密码不为空"  rule="password" label="原密码:" placeholder="请输入原密码"  v-model="dataForm.password"/>
        <van-field error-message="新密码不为空"  rule="newPassword" type="password" label="新密码:" placeholder="请输入新密码" v-model="dataForm.newPassword" />
        <van-field error-message="确认密码与新密码不一致"  rule="confirmPassword" type="password" label="确认密码:" placeholder="请输入确认密码" v-model="dataForm.confirmPassword" />
      </template>
    </vantForm>
  </van-dialog>
</template>

<script>
  import { clearLoginInfo } from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        dataRule: {
          'password': { required: true, message: '原密码不能为空', trigger: 'blur' },
          'newPassword': { required: true, message: '新密码不能为空', trigger: 'blur' },
          'confirmPassword': { required: true, message: '确认密码不能为空', trigger: 'blur', handleVailFun: val => { return val === this.dataForm.newPassword } }
        }
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      userAccount: {
        get () { return this.$store.state.user.account }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        // })
      },
      // 窗口关闭前的动作
      beforeClose (action, done) {
        done(!this.visible)
      },
      // 表单提交
      dataFormSubmit () {
          if (this.$refs['dataForm'].allVail()) {
            this.$http({
              url: this.$http.adornUrl('/sys/user/password'),
              method: 'post',
              data: this.$http.adornData({
                'password': this.dataForm.password,
                'newPassword': this.dataForm.newPassword
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$notify({ type: 'success', message: '操作成功' })
                this.visible = false
                clearLoginInfo()
                this.$router.replace({ name: 'login' })
              } else {
                this.$notify({ type: 'danger', message: data.msg })
              }
            })
          }
      }
    }
  }
</script>

<style scoped>
  .vant_from{
    overflow-y: auto;
    max-height: 500px;
  }

</style>

