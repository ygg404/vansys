<template>
  <van-dialog style="width:80%;" :title="!dataForm.id ? '新增' : '修改'"
              show-cancel-button confirm-button-text="确定"
              @cancel="visible = false"
              @confirm="dataFormSubmit"
              v-model="visible" :beforeClose="beforeClose">
    <van-form  ref="dataForm">
      <van-field label-align="center" v-model="dataForm.duty" name="jobTitle" label="职务"
                 :rules="[{ required: true, message: '请填写职务' }]" />
      <van-field label-align="center" v-model="dataForm.score" name="score" label="分数" type="number"
                 :rules="[{ required: true, message: '请填写分数' }]" />
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
          duty: '',
          score: '',
          orderNum: ''
        }
      }
    },
    methods: {
      beforeClose (action, done) {
        done(!this.visible)
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/set/scoreduty/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.duty = data.renScoreDuty.duty
                this.dataForm.score = data.renScoreDuty.score
                this.dataForm.orderNum = data.renScoreDuty.orderNum
              }
            })
          } else {
            this.dataForm.duty = ''
            this.dataForm.score = ''
            this.dataForm.orderNum = ''
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs.dataForm.validateAll().then(
          success => {
            this.$http({
              url: this.$http.adornUrl(`/set/scoreduty/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'duty': this.dataForm.duty,
                'score': this.dataForm.score,
                'orderNum': this.dataForm.orderNum
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
                this.$notify({
                  message: data.msg,
                  type: 'danger',
                  duration: 1500
                })
              }
            })
          })
      }
    }
  }
</script>
