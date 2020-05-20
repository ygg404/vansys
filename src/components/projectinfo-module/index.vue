<template>
  <van-collapse :value="panelShow" @change="panelShowEvent" style="width:95%;margin:0 auto;">
    <van-collapse-item title="项目基本信息" name="1" class="Infocollapse">
      <van-row style="margin-top:5px;" v-if="infotype == 1 || infotype == 6">
        <van-col span="7" style="text-align:center;">项目编号:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.projectNo}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;">
        <van-col span="7" style="text-align:center;">项目名称:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.projectName}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;">
        <van-col span="7" style="text-align:center;">项目类型:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.projectType}}</van-col>
      </van-row>
      <van-row
        style="margin-top:5px;"
        v-if="infotype == 1 || infotype == 2 || infotype == 3 || infotype == 4"
      >
        <van-col span="7" style="text-align:center;">委托单位:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.projectAuthorize}}</van-col>
      </van-row>
      <van-row
        style="margin-top:5px;"
        v-if="infotype == 1 || infotype == 2 || infotype == 3 || infotype == 4"
      >
        <van-col span="7" style="text-align:center;">委托要求:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.projectNote}}</van-col>
      </van-row>
      <van-row
        style="margin-top:5px;"
        v-if="infotype == 1 || infotype == 2 || infotype == 3 || infotype == 4 || infotype == 6"
      >
        <van-col span="7" style="text-align:center;">业务负责人:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.contractBusiness}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" if="infotype == 1">
        <van-col span="7" style="text-align:center;">项目立项人:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.createUserName}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 1">
        <van-col span="7" style="text-align:center;;">项目立项人:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.createUserName}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 1 || infotype == 2 || infotype == 6">
        <van-col span="7" style="text-align:center;">联系人:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.userName}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 1 || infotype == 2 || infotype == 6">
        <van-col span="7" style="text-align:center;;">联系人电话:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.userPhone}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 2">
        <van-col span="7" style="text-align:center;;">项目开工时间:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.projectBegunDateTime}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 2">
        <van-col span="7" style="text-align:center;;">执行标准:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.executeStandard}}</van-col>
      </van-row>
      <van-row
        style="margin-top:5px;"
        v-if="infotype == 3 || infotype == 4 || infotype == 5 || infotype == 6"
      >
        <van-col span="7" style="text-align:center;;">项目负责人:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.projectCharge}}</van-col>
      </van-row>
      <van-row
        style="margin-top:5px;"
        v-if="infotype == 3 || infotype == 4 || infotype == 5 || infotype == 6"
      >
        <van-col span="7" style="text-align:center;;">工作内容:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.workNote}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 3 || infotype == 4 ||  infotype == 6">
        <van-col span="7" style="text-align:center;;">工作要求:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.workRequire}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 3 || infotype == 4 ">
        <van-col span="7" style="text-align:center;;">工作小结:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.briefSummary}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 6">
        <van-col span="7" style="text-align:center;;">质量综述:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.qualityNote}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 6">
        <van-col span="7" style="text-align:center;;">质量评分:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.qualityScore}}</van-col>
      </van-row>
      <van-row style="margin-top:5px;" v-if="infotype == 6">
        <van-col span="7" style="text-align:center;;">质量等级:</van-col>
        <van-col span="17" style="text-align:left;padding-left:10px;">{{Info.qualityLevel}}</van-col>
      </van-row>
    </van-collapse-item>
  </van-collapse>
</template>

<script>
export default {
  props: ["Info", "infotype"],
  data() {
    return {
      panelShow: []
    };
  },
  watch: {
    Info(val) {
      console.log(val);
    }
  },
  methods: {
    //
    panelShowEvent() {
      if (this.panelShow.length == 1) {
        this.panelShow = [];
      } else {
        this.panelShow = ["1"];
      }
    },
    //
    closeHandle() {
      this.$emit("close");
    },
    confirmHandle() {
      this.$emit("close");
    }
  },
  mounted() {
    if (this.Info) {
      this.panelShow = ["1"];
    }
  }
};
</script>

<style scoped>
.Infocollapse .van-cell__title:nth-child(1) {
  font-size: 16px;
}
.Infocollapse .van-collapse-item__content {
  color: #1a1b1c;
  padding: 0 10px;
}
</style>
