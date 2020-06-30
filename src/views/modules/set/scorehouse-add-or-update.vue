<template>
 <div>
   <van-dialog style="width:80%;" :title="!dataForm.id ? '新增' : '修改'"
               show-cancel-button confirm-button-text="确定"
               @cancel="visible = false"
               @confirm="dataFormSubmit"
               v-model="visible" :beforeClose="beforeClose">
     <van-form ref="dataForm">
       <van-field label-align="center" v-model="dataForm.lowScore" name="lowScore" label="分数下限"
                  :rules="[{ required: true, message: '请填写分数下限' }]" />
       <van-field label-align="center" v-model="dataForm.highScore" name="highScore" label="分数上限"
                  :rules="[{ required: true, message: '请填写分数上限' }]" />
       <van-field label-align="center" v-model="dataForm.jobRank" name="jobRank" label="职级名称"
                  :rules="[{ required: true, message: '请填写职级名称' }]" />
       <van-field label-align="center" v-model="dataForm.houseAdd" name="houseAdd" label="住房补贴"
                  :rules="[{ required: true, message: '请填写住房补贴' }]" />
     </van-form>
   </van-dialog>
 </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          lowScore: '',
          highScore: '',
          jobRank: '',
          houseAdd: '',
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
              url: this.$http.adornUrl(`/set/scorehouse/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.lowScore = data.renScoreHouse.lowScore
                this.dataForm.highScore = data.renScoreHouse.highScore
                this.dataForm.jobRank = data.renScoreHouse.jobRank
                this.dataForm.houseAdd = data.renScoreHouse.houseAdd
                this.dataForm.orderNum = data.renScoreHouse.orderNum
              }
            })
          } else {
            this.dataForm.lowScore = ''
            this.dataForm.highScore = ''
            this.dataForm.jobRank = ''
            this.dataForm.houseAdd = ''
            this.dataForm.orderNum = ''
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs.dataForm.validateAll().then(
          success => {
            this.$http({
              url: this.$http.adornUrl(`/set/scorehouse/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'lowScore': this.dataForm.lowScore,
                'highScore': this.dataForm.highScore,
                'jobRank': this.dataForm.jobRank,
                'houseAdd': this.dataForm.houseAdd,
                'orderNum': this.dataForm.orderNum
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
