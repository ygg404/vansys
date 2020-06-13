<template>
<div>
  <van-dialog v-model="visible" title="项目返修内容" width="90%" confirmButtonText="取消">
    <div style="overflow: auto; width: 100%;">
      <table style="width:150%;">
        <thead>
        <tr>
          <td class="tac">返修日期</td>
          <td class="tac">返修要求</td>
          <td class="tac">操作</td>
          <td class="tac">修改说明</td>
          <td class="tac">修改日期</td>
        </tr>
        </thead>
        <tbody v-for="(item, index) in dataList">
        <tr>
           <td class="tac">{{item.backCreateTime | dataStr}}</td>
           <td class="tac"><van-button type="info" size="small" @click="checkReportHandle(item)">查看内容</van-button></td>
          <td class="tac"><van-button type="primary" size="small"  @click="addNoteHandle(item)" v-if="item.submitNote == null">编辑</van-button></td>
          <td class="tac">{{item.submitNote}}</td>
           <td class="tac">{{item.submitCreateTime | dataStr}}</td>
        </tr>
        </tbody>
      </table>

      <div style="margin-bottom:10px;margin-top:10px;">
        <div class="quality_card_title">{{reportTitle}}</div>
        <div ref="reportId" class="quality_report" ></div>
      </div>
    </div>

  </van-dialog>

  <van-dialog title="编辑回复"  v-model="noteVisible" width="90%" show-cancel-button @confirm="dataFormSubmit">
    <wang-editor  :id="editorId" :content="ueContent" :projectNo="dataForm.projectNo" @refreshContent="getReportHandle"></wang-editor>
  </van-dialog>
</div>
</template>

<script>
  import WangEditor from '@/components/WangEditor/index'
  import moment from 'moment'
  export default {
    data () {
      return {
        datePickerShow: false,
        editorId: 'wangId',
        visible: false,
        noteVisible: false,
        reportVisible: false,
        reportTitle: '',
        isEdit: true,
        imageList: [], // 报告图片列表
        curprog: 0,   // 当前进度
        totalprog: 1,  // 总进度
        curRate: 0,  // 进度百分比
        proLoading: false, // 获取进度显示
        editLoading: false, // 编辑获取文章进度
        ueContent: '', // 修改说明在线编辑内容
        postLoading: false, // 上传
        loadingText: '', // 上传文本
        dataForm: {
          id: 0,
          projectno: '',
          backnote: '',
          backcreatetime: '',
          submitNote: '',
          submitcreatetime: '',
          backstage: '',
          backdatenum: '',
          groupid: ''
        },
        dataRule: {
          submitNote: [
            { required: true, message: '提交内容不能为空', trigger: 'blur' }
          ]
        },
        dataList: []
      }
    },
    filters:{
      'dataStr':function(str){
        if(str === '' || str === null)
          return ''
        return moment(new Date(str)).format('YYYY-MM-DD');
      }
    },
    components: {
      WangEditor
    },
    methods: {
      init (projectNo,isEdit) {
        this.visible = true
        this.isEdit = isEdit
        this.$nextTick(() => {
          this.proLoading = true
          if (projectNo) {
            this.$http({
              url: this.$http.adornUrl(`/project/backwork/list/${projectNo}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataList = data.list
                this.$refs.reportId.innerHTML = ''
                this.proLoading = false
              }
            })
          }
        })
      },
      // 返修列表关闭事件
      reportDialogClose () {
        this.reportVisible = false
        this.visible = false
      },

      // 添加提交内容
      addNoteHandle (item) {
        this.dataForm.id = item.id
        this.dataForm.projectNo = item.projectNo
        this.noteVisible = true
        this.reportVisible = false
        this.curprog = 0
        this.$refs.reportId.innerHTML = ''
        this.ueContent = item.backNote
      },
      // 查看返修要求说明内容
      checkReportHandle (item) {
        this.reportVisible = true
        this.reportTitle = '质检反馈报告（ 日期：' + item.backCreateTime + ')'
        this.$refs.reportId.innerHTML = item.backNote
      },
      // 实时获取编辑报告内容
      getReportHandle (content) {
        this.ueContent = content
      },
      // 通过后台获取质检返修记录的反馈(spaceFlag为true先获取文章大小)
      getReportFromApi (item) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/backwork/info`),
            method: 'get',
            params: this.$http.adornParams({
              'id': item.id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.ueContent = data.backwork.backNote
              resolve(data)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        let that = this
        that.loadingText = ''
        that.postLoading = true
        this.$http({
          url: this.$http.adornUrl(`/project/backwork/update`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id,
            'projectNo': this.dataForm.projectNo,
            'submitNote': this.ueContent,
            'backStage': 1
          }),
          // 加载进度的事件
          onUploadProgress: function (progressEvent) {
            that.loadingText = '正在上传中...（' + parseInt(progressEvent.loaded * 100 / progressEvent.total).toString() + '%)'
          }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            that.postLoading = false
            this.noteVisible = false
            this.visible = false
            this.$emit('refreshDataList')
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style>
  .tac{
    text-align: center;
  }
  .scbtn .van-button--normal {
    padding: 0 6px;
  }

  .rootBar{
    width: 100%;
    height: 216px;
    float: left;
    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
  .cBar{
    width: 25%;
    height: 20px;
    position: relative;
    display: inline-block;
  }
  .ccBar{
    width: 25%;
    height: 20px;
    position: relative;
    display: inline-block;
  }
  .hbar{
    width: 100%;
    height: 20px;
    word-wrap:break-word;
  }
  .tBar{
    width: 25%;
    height: 20px;
    font-size:14px;
    position: relative;
    display: inline-block;
  }


</style>
