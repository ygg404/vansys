<template>
  <van-dialog
    title="新增进度"
    width="95%"
    v-model="visible"
    show-cancel-button  @confirm="dataFormSubmit" :style="'max-height: ' + (documentClientHeight - 200).toString() + 'px'">
    <van-cell-group>
      <van-field v-model="dataForm.projectNo" label="项目编号" placeholder="项目编号" disabled />
    </van-cell-group>
    <van-cell-group>
      <van-field v-model="dataForm.projectName" label="项目名称" placeholder="项目名称" disabled />
    </van-cell-group>
    <van-row type="flex" align="center" justify="center">
      <van-col span="2"></van-col>
      <van-col span="10">进度百分比</van-col>
      <van-col span="12"><van-stepper v-model="scheduleRatenum" @change="sliderChangeHandle"/></van-col>
    </van-row>
    <van-row type="flex" align="center" class="mbmt20">
      <van-col span="1"></van-col>
      <van-col span="22">
        <van-slider v-model="scheduleRatenum" @change="sliderChangeHandle"/>
      </van-col>
      <van-col span="1"></van-col>
    </van-row>
     <div style="margin:auto 10%;">
       <textarea  class="pc" v-model="dataForm.scheduleNote"></textarea>
     </div>
  </van-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        scheduleRatenum: 0,
        dataForm: {
          id: 0,
          projectNo: '',
          projectName: '',
          scheduleNote: '',
          scheduleRate: '',
          createTime: ''
        }
      }
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.$nextTick(() => {
          console.log(item)
          this.dataForm.projectNo = item.projectNo
          this.dataForm.projectName = item.projectName
          this.dataForm.scheduleNote = ''
          this.dataForm.scheduleRate = item.scheduleRate !== null ? item.scheduleRate : 0
          this.scheduleRatenum = parseInt(this.dataForm.scheduleRate, 10)
        })
      },
      // 进度改变
      sliderChangeHandle () {
        if (this.scheduleRatenum > 90) {
          this.$notify({ type: 'danger', message: '作业进度不得超过90%' })
          this.dataForm.scheduleRate = 90
          this.scheduleRatenum = 90
        } else {
          this.dataForm.scheduleRate = this.scheduleRatenum.toString()
        }
      },
      // 表单提交
      dataFormSubmit () {
        if (this.scheduleRatenum > 90) {
          this.$notify({ type: 'danger', message: '作业进度不得超过90%' })
          this.dataForm.scheduleRate = 90
          this.scheduleRatenum = 90
        } else {
          this.dataForm.scheduleRate = this.scheduleRatenum.toString()
          this.$http({
            url: this.$http.adornUrl(`/project/schedule/save`),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': this.dataForm.projectNo,
              'scheduleNote': this.dataForm.scheduleNote,
              'scheduleRate': this.dataForm.scheduleRate
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
              this.$message.error(data.msg)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .pc{
    width:100%;
    border: 1px dotted rgb(195, 197, 199);
    border-radius:10px;
    overflow:scroll;
    height:120px;
    letter-spacing:1.4px;
  }
  .mbmt20{
    margin-bottom:20px;margin-top:20px;
  }
</style>
