<template>
  <div>
    <div class="header">{{title}}</div>
    <div class="check_group">
      <van-checkbox-group v-model="result" ref="checkboxGroup">
        <van-checkbox
          v-for="item in dataList"
          :key="item.id"
          :name="item.id"
          style="padding: 5px;"
          shape
        >{{item.shortcutNote}}</van-checkbox>
      </van-checkbox-group>
    </div>
    <div class="btn_bottom">
      <van-button plain @click="closeHandle">取消</van-button>
      <van-button type="info" @click="confirmHandle">确认</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
      //修改的值 不提倡
    value: {
      type: Object,
      default: Object
    },
    //标题
    title: {
      type: String,
      default: ""
    },
    //遍历对象
    dataList: {
      type: Array,
      default: []
    },
    //类型
    selectType: {
      type: Number,
      default: 0
    },
  },

  data() {
    return {
      visible: false,
      result: []
    };
  },
  watch: {
    value(val) {
      console.log(val);
    }
  },
  methods: {
    closeHandle() {
      this.$emit("close");
    },
    confirmHandle() {
         // 执行内容处理
      if (this.selectType == 1) {
        this.value.executeStandard = "";
        for (let item of this.result) {
          for (let note of this.dataList) {
            if (note.id === item)
              this.value.executeStandard =
                this.value.executeStandard + note.shortcutNote + ";";
          }
        }
      }
      // 工作内容处理
      if (this.selectType == 2) {
        this.value.workNote = "";
        for (let item of this.result) {
          for (let note of this.dataList) {
            if (note.id === item)
              this.value.workNote =
                this.value.workNote + note.shortcutNote + ";";
          }
        }
      }
      // 技术要求处理
      if (this.selectType == 3) {
        this.value.workRequire = "";
        for (let item of this.result) {
          for (let note of this.dataList) {
            if (note.id === item)
              this.value.workRequire =
                this.value.workRequire + note.shortcutNote + ";";
          }
        }
      }
      //技术交底
      if (this.selectType == 4) {
        this.value.technicalDisclosureNote = "";
        for (let item of this.result) {
          for (let note of this.dataList) {
            if (note.id === item)
              this.value.technicalDisclosureNote =
                this.value.technicalDisclosureNote + note.shortcutNote + ";";
          }
        }
      }
//过程检查意见
      if (this.selectType == 5) {
        this.value.checkSuggestion = "";
        for (let item of this.result) {
          for (let note of this.dataList) {
            if (note.id === item)
              this.value.checkSuggestion =
                this.value.checkSuggestion + note.shortcutNote + ";";
          }
        }
      }
      //上交资料
      if (this.selectType == 6) {
        this.value.dataName = "";
        for (let item of this.result) {
          for (let note of this.dataList) {
            if (note.id === item)
              this.value.dataName =
                this.value.dataName + note.shortcutNote + ";";
          }
        }
      }
      //工作小结
      if (this.selectType == 7) {
        this.value.briefSummary = "";
        for (let item of this.result) {
          for (let note of this.dataList) {
            if (note.id === item)
              this.value.briefSummary =
                this.value.briefSummary + note.shortcutNote + ";";
          }
        }
      }
      //工作量
      if (this.selectType == 8) {
        this.value.workLoad = "";
        for (let item of this.result) {
          for (let note of this.dataList) {
            if (note.id === item)
              this.value.workLoad =
                this.value.workLoad + note.shortcutNote + ";";
          }
        }
      }
      if (this.selectType == 9) {
        this.value.qualityNote = "";
        for (let item of this.result) {
          for (let note of this.dataList) {
            if (note.id === item)
              this.value.qualityNote =
                this.value.qualityNote + note.shortcutNote + ";";
          }
        }
      }
      this.$emit("close");
    }
  },
  mounted() {
    if (this.value) {
      this.visible = true;
    }
  }
};
</script>

<style scoped>
.header {
  font-size: 13pt;
  font-weight: 700;
  text-align: center;
  width: 100%;
}
.check_group {
  max-height: 500px;
  margin-top: 4px;
  overflow-y: visible;
  overflow-x: hidden;
  width: 100%;
  text-align: left;
  padding: 2px;
  border-top: 1px solid #3b97d7;
}
.btn_bottom {
  border-top: 1px solid #3b97d7;
  display: flex;
  font-size: 14pt;
}
.btn_bottom button {
  width: 50%;
}
</style>
