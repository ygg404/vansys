<template>
  <van-dialog
    title="编辑质检反馈"
    show-cancel-button
    width="90%" style="height:440px;"
    v-model="visible" @cancel="closeHandle" @confirm="setReportHandle">
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
      // 实时获取编辑报告内容
      getReportHandle (content) {
        this.ueContent = content
      },
      // 设置报告内容
      setReportHandle () {
        this.visible = false
        this.$emit('refreshReport', this.ueContent)
      }
    }
  }
</script>

<style >
 .toolbar {
  border: 1px solid #ccc;
 }
</style>
