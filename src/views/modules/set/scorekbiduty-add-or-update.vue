<template>
  <van-dialog style="width:85%;" :title="!dataForm.id ? '新增' : '修改'"
              show-cancel-button confirm-button-text="确定"
              @cancel="visible = false"
              @confirm="dataFormSubmit"
              v-model="visible" :beforeClose="beforeClose">
    <van-form  ref="dataForm">
      <van-field  v-model="dataForm.dutyName" name="dutyName" label="职务"
                  :rules="[{ required: true, message: '请填写职务' }]" />
      <van-field  v-model="dataForm.standardScore" name="standardScore" label="基准分" type="number"
                  :rules="[{ required: true, message: '请填写基准分' }]" />
      <van-field  v-model="dataForm.assessnoScore" name="assessnoScore" label="未考核效能分" type="number"
                  :rules="[{ required: true, message: '请填写未考核效能分' }]" />
      <van-field  v-model="dataForm.trialScore" name="trialScore" label="试用期效能分" type="number"
                  :rules="[{ required: true, message: '请填写试用期效能分' }]" />
    </van-form>
  </van-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          dutyId: 0,
          dutyName: '',
          standardScore: '',
          assessnoScore: '',
          trialScore: ''
        }
      }
    },
    methods: {
      beforeClose (action, done) {
        done(!this.visible)
      },
      init (id) {
        this.dataForm.dutyId = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.dutyId) {
            this.$http({
              url: this.$http.adornUrl(`/set/scorekbiduty/info/${this.dataForm.dutyId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dutyName = data.scoreKbiDuty.dutyName
                this.dataForm.standardScore = data.scoreKbiDuty.standardScore
                this.dataForm.assessnoScore = data.scoreKbiDuty.assessnoScore
                this.dataForm.trialScore = data.scoreKbiDuty.trialScore
              }
            })
          }else{
            this.dataForm.dutyName = ''
            this.dataForm.standardScore = ''
            this.dataForm.assessnoScore = ''
            this.dataForm.trialScore = ''
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs.dataForm.validateAll().then(
          success => {
            this.$http({
              url: this.$http.adornUrl(`/set/scorekbiduty/save`),
              method: 'post',
              data: this.$http.adornData({
                'dutyId': this.dataForm.dutyId || undefined,
                'standardScore': this.dataForm.standardScore,
                'assessnoScore': this.dataForm.assessnoScore,
                'trialScore': this.dataForm.trialScore
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$notify({
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
