<template>
  <div class="mod-config">
    <projectInfo :Info="projectInfo" :infotype="3"/>
    <van-collapse v-model="panelRShow"  style="width:95%;margin:0 auto;">
      <van-collapse-item title="返修记录信息" name="1" class="InfoTitle">
        <van-row style="margin-top:2px;padding-top:5px;padding-bottom:5px;border-bottom: 1px solid rgb(195, 197, 199);">
          <van-col span="8" style="text-align:center;">返修日期</van-col>
          <van-col span="8" style="text-align:center;">返修要求</van-col>
          <van-col span="8" style="text-align:center;">修改说明</van-col>
        </van-row>
        <van-list :key="index" v-for="(item, index) in backWorkList" >
          <van-row type="flex" align="center" justify="center">
            <van-col span="8" style="text-align:center;">{{item.backCreateTime}}</van-col>
            <van-col span="8">
              <van-row type="flex" justify="center" align="center">
                <button class="cnbtn" @click="checkReportHandle(item)">查看内容</button>
              </van-row>
            </van-col>
            <van-col span="8" style="text-align:center;">{{item.submitCreateTime}}</van-col>
          </van-row>
        </van-list>
        <div style="width:90%;">
          <div class="quality_card_title">{{reportTitle}}</div>
          <div ref="reportPreId" ></div>
        </div>
      </van-collapse-item>
    </van-collapse>


    <van-row style="height:40px; padding:10px;" type="flex" justify="center" align="center">
      <van-col span="8">
        <van-row type="flex" justify="center" align="center">
          <van-col><span style="font-size:14px;">质量检查信息</span></van-col>
        </van-row>
      </van-col>
      <van-col span="8">
        <button class="cnbtn btngreen" @click="editQualityReportHandler">编辑质检反馈</button>
      </van-col>
      <van-col span="8">
        <button class="cnbtn" @click="addQualityscoreHandler">编辑质量评分</button>
      </van-col>
    </van-row>

    <van-collapse v-model="panelQIFShow" style="width:95%;margin:0 auto;">
      <van-collapse-item title="质检反馈" name="1" class="InfoTitle">
        <div ref="reportId"></div>
      </van-collapse-item>
    </van-collapse>

    <van-form  ref="dataForm" style="margin-top:10px;">
      <van-row type="flex" align="center" justify="center" class="qsn">
        <van-col span="15">
          <van-field v-model="dataForm.qualityScore"  label="质量分数" type="number"
                     :rules="[{ required: true, message: '质量分数不能为空' }]" />
        </van-col>
      </van-row>
    </van-form>

    <van-row style="margin-bottom:20px;margin-top:10px;">
      <van-col span="6" class="tac"><van-button size="small" color="#E6A23C" @click="goBack">返回</van-button></van-col>
      <van-col span="6" class="tac"><van-button size="small" type="info" @click="dataFormSubmit" :disabled="isCheck == 2">提交</van-button></van-col>
      <van-col span="6" class="tac"><van-button size="small" color="#F56C6C" @click="repairNoteSubmit" :disabled="isCheck == 2">退回返修</van-button></van-col>
      <van-col span="6" class="tac"><van-button size="small" color="#F56C6C" @click="recallRepairHandle" :disabled="isCheck != 2">撤回返修</van-button></van-col>
    </van-row>

    <qualityscore-add-or-update v-if="qualityScoreVisible" ref="qualityscoreAddOrUpdate" @refreshDataList="setQualityScore"></qualityscore-add-or-update>
    <qualityedit-add-or-update v-if="editVisible" ref="qualityeditAddOrUpdate" @refreshReport="setQualityReport"></qualityedit-add-or-update>
  </div>
</template>

<script>
  import {closeTab} from '@/utils/tabs'
  import qualityscoreAddOrUpdate from './qualityscore-add-or-update'
  import qualityeditAddOrUpdate from './qualityedit-add-or-update'
  import projectInfo from '@/components/projectinfo-module'
  export default {
    data () {
      return {
        panelRShow: ['1'],
        panelQIFShow: ['1'],
        projectNo: '',
        isCheck: 0, // 检查状态： 2为返修中
        projectInfo: '',
        qualityNotelist: [],
        qualityNoteValue: '',
        reportTitle: '',
        qualityScoreVisible: false,
        repairVisible: false,
        editVisible: false,
        backWorkList: [],
        dataForm: {
          id: '',
          qualityNote: '',
          qualityScore: ''
        },
        repairNotelist: [], // 返修快捷输入列表
        repairValue: '', // 返修短语
        repairForm: {
          backNote: ''
        },  // 返修意见
        repairRule: {
          backNote: [
            { required: true, message: '返修意见不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      qualityscoreAddOrUpdate,
      qualityeditAddOrUpdate,
      projectInfo
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.projectNo = this.$route.query.projectNo
        this.getInfoByProjectNo(this.projectNo)
        this.dataLoading = true
        this.loadingText = ''
        this.getQualityByProjectNo(this.projectNo).then(data => {
          this.dataLoading = false
        })
        this.getBackworkHandle(this.projectNo)
        this.getQualityNotelist()
        this.getRepairNotelist()
      },
      // 提交数据
      dataFormSubmit () {
        this.$refs.dataForm.validateAll().then(
        success => {
          let that = this
          that.dataLoading = true
          that.loadingText = ''
          that.activeNames = []
          this.$http({
            url: this.$http.adornUrl(`/project/quality/save`),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': this.projectNo,
              'qualityNote': this.dataForm.qualityNote,
              'qualityScore': this.dataForm.qualityScore,
              'qualityReport': this.dataForm.qualityReport
            }),
            onUploadProgress (proEvent) {
              that.loadingText = '正在上传中（' + parseInt(proEvent.loaded * 100 / proEvent.total).toString() + '%)'
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              that.dataLoading = false
              this.$notify({
                message: '保存并提交成功',
                type: 'success',
                duration: 1500
              })
              this.visible = false
              this.$emit('refreshDataList')
              this.goBack()
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
      },
      // 查看质检反馈内容
      checkReportHandle (item) {
        console.log(this.$refs)
        this.$refs.reportPreId.innerHTML = item.backNote
        this.reportVisible = true
        this.reportTitle = '质检反馈报告（ 日期：' + item.backCreateTime + ')'
        this.curprog = 0
        // this.$refs.reportPreId.innerHTML = item.backNote
      },
      // 返修列表关闭事件
      reportDialogClose () {
        this.reportVisible = false
        this.visible = false
      },
      // 获取项目基本信息
      getInfoByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/projectInfo/info/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectInfo = data.projectInfo
              resolve(data.projectInfo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取质检信息
      getQualityByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/quality/getInfo`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.checkQuality != null) {
                this.dataForm.id = data.checkQuality.id
                this.dataForm.qualityNote = data.checkQuality.qualityNote
                this.dataForm.qualityScore = data.checkQuality.qualityScore
                this.dataForm.qualityReport = data.checkQuality.qualityReport
                this.$refs.reportId.innerHTML = data.checkQuality.qualityReport
                this.isCheck = data.isCheck
              }
              resolve(data)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取返修内容列表
      getBackworkHandle (projectNo) {
        this.$http({
          url: this.$http.adornUrl(`/project/backwork/list/${projectNo}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.backWorkList = data.list
          } else {
            this.backWorkList = []
          }
        })
      },
      // 获取质量综述列表
      getQualityNotelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/9`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.qualityNotelist = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取返修综述列表
      getRepairNotelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/12`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.repairNotelist = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      qualityNoteHandler () {
        this.dataForm.qualityNote = ''
        for (let value of this.qualityNoteValue) {
          for (let note of this.qualityNotelist) {
            if (note.id === value) this.dataForm.qualityNote = this.dataForm.qualityNote + note.shortcutNote + ';'
          }
        }
      },
      // 提交退回返修
      repairNoteSubmit () {
        this.activeNames = []
        let that = this
        this.$dialog.alert({
          title: '提示',
          message: '是否确定退回返修，并将质检报告反馈于作业人员？',
          showCancelButton: true
        }).then(() => {
          if (this.dataForm.qualityReport === null || this.dataForm.qualityReport === '') {
            this.$message.error('质检反馈报告不能为空!')
            return
          }
          that.dataLoading = true
          that.loadingText = ''
          this.$http({
            url: this.$http.adornUrl(`/project/backwork/save`),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': this.projectNo,
              'backNote': this.dataForm.qualityReport
            }),
            onUploadProgress (proEvent) {
              that.loadingText = '正在上传中（' + parseInt(proEvent.loaded * 100 / proEvent.total).toString() + '%)'
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$notify({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              that.dataLoading = false
              this.visible = false
              this.$emit('refreshDataList')
              this.goBack()
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
            }
          })
        }).catch(() => {

        })
      },
      // 添加质量评分
      addQualityscoreHandler () {
        this.qualityScoreVisible = true
        this.$nextTick(() => {
          this.$refs.qualityscoreAddOrUpdate.init(this.projectNo)
        })
      },
      // 质量评分设置
      setQualityScore (score) {
        this.dataForm.qualityScore = score
      },
      // 设置报告内容
      setQualityReport (content) {
        this.activeNames = ['report']
        this.dataForm.qualityReport = content
        this.$refs.reportId.innerHTML = content
      },
      // 质检报告的编辑
      editQualityReportHandler () {
        this.editVisible = true
        this.$nextTick(() => {
          this.$refs.qualityeditAddOrUpdate.init(this.dataForm.qualityReport, this.projectNo)
        })
      },
      // 撤回返修
      recallRepairHandle () {
        this.$dialog.confirm({
          title: '提示',
          message: '是否确定撤回质检反馈报告？'}
        ).then(() => {
          this.$refs.reportPreId.innerHTML = ''
          this.$http({
            url: this.$http.adornUrl(`/project/backwork/delete`),
            method: 'post',
            data: this.projectNo
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$notify({
                message: '撤销返修成功',
                type: 'success',
                duration: 1500
              })
              this.init()
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
            }
          })
        })
      },
      // 返回
      goBack () {
        closeTab('project-editquality')
        this.$router.push('project-project')
      }
    },
    watch: {
      '$route': function (to, from) {
        this.projectNo = to.query['projectNo']
        // 执行数据更新查询
        if (to.name === 'project-editquality') {
          this.init()
        } else {
          closeTab('project-editquality')
        }
      },
      activeNames: function (val) {
        if (val.indexOf('preReport') !== -1) {
          this.reportVisible = false
          this.proLoading = false
          this.$refs.reportPreId.innerHTML = ''
        }
      }
    }

  }
</script>

<style scoped>
  .form_class{
    margin-top: 20px;

  }

  .span_title {
    font-size: 18px;
    font-weight: 700;
  }

  .bottom_btn{
    margin: 20px;
    width: 100%;
    text-align: center;
  }
  .cnbtn{
     color: #fff;
    background-color: #1989fa;
    border: 1px solid #1989fa;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    margin: 0;
    padding-right: 8px;
    padding-left:8px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
  }
  .footerbtngroup{
    display: flex;align-items: center;justify-content: center;
  }
  .btnyellow{
    background-color: #E6A23C;border: 1px solid #E6A23C;
  }
  .btnLightblue{
    background-color: lightskyblue;border: 1px solid lightskyblue;
  }
  .btnpink{
    background-color: #F56C6C;border: 1px solid #F56C6C;
  }
  .btnLightpink{
    background-color: #fab6b6;border: 1px solid #fab6b6;
  }
  .btngreen{
    background-color: #67C23A;border: 1px solid #67C23A;
  }
  .qsn .van-col {
    /*margin:10px 10px;*/
    border: 1px dashed #d9d2d2;
}
.qsn .van-cell{
  padding:0px;
  height:100%;
  font-size:16px;
}

</style>
