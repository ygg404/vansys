<template>
  <van-dialog style="width:85%;" :title="!dataForm.id ? '新增' : '修改'"
              show-cancel-button confirm-button-text="确定"
              @cancel="visible = false"
              @confirm="dataFormSubmit"
              v-model="visible" :beforeClose="beforeClose">
    <van-form  ref="dataForm">
      <van-field  v-model="dataForm.titleName" name="titleName" label="职称"
                 :rules="[{ required: true, message: '请填写职称' }]" />
      <van-field  v-model="dataForm.standardScore" name="standardScore" label="效能分基准分" type="number"
                 :rules="[{ required: true, message: '请填写效能分基准分' }]" />
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
          titleId: 0,
          standardScore: '',
          assessnoScore: '',
          trialScore: '',
          titleName: ''
        }
      }
    },
    methods: {
      beforeClose (action, done) {
        done(!this.visible)
      },
      init (id) {
        this.dataForm.titleId = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.titleId) {
            this.$http({
              url: this.$http.adornUrl(`/set/scorekbititle/info/${this.dataForm.titleId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.titleName = data.scoreKbiTitle.titleName
                this.dataForm.standardScore = data.scoreKbiTitle.standardScore
                this.dataForm.assessnoScore = data.scoreKbiTitle.assessnoScore
                this.dataForm.trialScore = data.scoreKbiTitle.trialScore
              }
            })
          } else {
            this.dataForm.titleName = ''
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
              url: this.$http.adornUrl(`/set/scorekbititle/save`),
              method: 'post',
              data: this.$http.adornData({
                'titleId': this.dataForm.titleId || undefined,
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
