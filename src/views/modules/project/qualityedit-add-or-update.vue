<template>
  <van-dialog
    title="编辑质检反馈"
    show-cancel-button confirm-button-text="保存"
    width="90%"  :beforeClose="beforeClose"
    v-model="visible" @cancel="closeHandle" @confirm="saveReportHandle" >
    <div>
      <wang-editor :content="ueContent" :id='id' :projectNo="projectNo" @refreshContent="getReportHandle" class="toolbar"></wang-editor>
    </div>


  </van-dialog>
</template>

<script>
  import WangEditor from '@/components/WangEditor'
  export default {
    name: 'qualityedit-add-or-update',
    data () {
      return {
        id: 'qualityEditor',
        ueContent: '',
        projectNo: '',
        visible: false
      }
    },
    components: {
      WangEditor
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    methods: {
      init (content, projectNo) {
        // if (this.editor !== '') this.editor.empty()
        this.projectNo = projectNo
        this.visible = true
        this.ueContent = content
      },
      // 关闭
      closeHandle () {
        this.visible = false
      },
      // 窗口关闭前的动作
      beforeClose (action, done) {
        console.log(this.visible)
        done(!this.visible)
      },
      // 实时获取编辑报告内容
      getReportHandle (content) {
        this.ueContent = content
      },
      // 保存报告内容
      saveReportHandle () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl(`/project/quality/saveTemp`),
          method: 'post',
          data: this.$http.adornData({
            'projectNo': this.projectNo,
            'qualityReport': this.ueContent
          })
        }).then(({data}) => {
          this.loading = false
          if (data && data.code === 0) {
            this.$message({
              message: '保存成功！',
              type: 'success',
              duration: 1500
            })
            this.$emit('refreshReport', this.ueContent)
            this.visible = false
          } else {
            this.$message.error(data.msg)
          }
        })
      },
    }
  }
</script>

<style >
  .toolbar {
    border: 1px solid #ccc;
  }
  .w-e-text-container{
    height: 400px !important;
  }
</style>
