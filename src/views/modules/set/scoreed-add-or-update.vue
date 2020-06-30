<template>
    <van-dialog style="width:95%;" :title="!dataForm.id ? '新增' : '修改'"
                show-cancel-button confirm-button-text="确定"
                @cancel="visible = false"
                @confirm="dataFormSubmit"
                v-model="visible" :beforeClose="beforeClose">
      <van-form  ref="dataForm">
        <van-field label-align="center" v-model="dataForm.cateid" label="类别" name="cateid" :rules="[{ required: true, message: '请选择类别' }]">
          <template slot="input">
            <div style="padding-right:7px;"><input type="radio"  v-model="dataForm.cateid" id="s1" value="1"  />学制系数</div>
            <div style="padding-right:7px;"><input type="radio"  v-model="dataForm.cateid" id="s2" value="2"  />专业系数</div>
            <div style="padding-right:7px;"><input type="radio"  v-model="dataForm.cateid" id="s3" value="3"  />学历系数</div>
          </template>
        </van-field>
        <van-field label-align="center" v-model="dataForm.scoreName" name="scoreName" label="对应项" disabled
                   :rules="[{ required: true, message: '请填写对应项名称' }]" />
        <van-field label-align="center" v-model="dataForm.score" name="score" label="分数"
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
          scoreName: '',
          cateid: '',
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
              url: this.$http.adornUrl(`/set/scoreed/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.scoreName = data.setScoreEd.scoreName
                this.dataForm.cateid = data.setScoreEd.cateid
                this.dataForm.score = data.setScoreEd.score
                this.dataForm.orderNum = data.setScoreEd.orderNum
              }
            })
          } else {
            this.dataForm.scoreName = ''
            this.dataForm.cateid = ''
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
              url: this.$http.adornUrl(`/set/scoreed/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'scoreName': this.dataForm.scoreName,
                'cateid': this.dataForm.cateid,
                'score': this.dataForm.score,
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
          }
        )
      }
    }
  }
</script>

<style scoped>
  .van-cell{
    padding:5px 5px;
  }

</style>
