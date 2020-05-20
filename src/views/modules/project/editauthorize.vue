<template>
  <div>
    <div>
      <projectInfo :Info="projectInfo" :infotype="6"/>
    </div>

    <!---->

    <van-row style="margin-top:5px;">
      <div
        style="margin-left:10%; font-size:16px; font-weight:700;margin-bottom:5px;margin-top:10px;"
      >审定意见</div>
      <van-col span="24" style="padding-left:5%;">
        <textarea rows="8" cols="40" class="shortcutstyle fontspac" v-model="dataForm.examineNote"></textarea>
      </van-col>
    </van-row>

   <div style="margin-top:20px;">
      <van-row type="flex" justify="space-around" align="center">
        <van-col span="10">
         <div style="text-align:center; width:100%;height:100%;margin:0px; ">     
         <van-button @click="goBack()" type="warning" >返回</van-button>
         </div>  
        </van-col>
         <van-col span="10">
         <div style="text-align:center; width:100%;height:100%;margin:0px; ">     
         <van-button  @click="dataFormSubmit" type="info">提交</van-button>
         </div>  
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { closeTab } from "@/utils/tabs";
import projectInfo from '@/components/projectinfo-module'
export default {
  data() {
    return {
      panelShow: ["1"],
      projectInfo: "",
      projectNo: this.$route.query.projectNo,
      dataForm: {
        id: "",
        projectNo: "",
        examineNote: ""
      }
    };
  },
  mounted() {
    this.init();
  },
  components:{
    projectInfo
  },
  methods: {
    panelShowEvent() {
      if (this.panelShow.length == 1) {
        this.panelShow = [];
      } else {
        this.panelShow = ["1"];
      }
    },
    init() {
      this.getInfoByProjectNo(this.projectNo);
      this.getEntityByProjectNo(this.projectNo);
    },
    // 获取项目基本信息
    getInfoByProjectNo(projectNo) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/project/projectInfo/info/${projectNo}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.projectInfo = data.projectInfo;
            if (this.projectInfo.qualityScore < 60) {
              this.projectInfo.qualityLevel = "不合格";
            } else if (
              this.projectInfo.qualityScore >= 60 &&
              this.projectInfo.qualityScore <= 50
            ) {
              this.projectInfo.qualityLevel = "合格";
            } else if (
              this.projectInfo.qualityScore > 50 &&
              this.projectInfo.qualityScore < 90
            ) {
              this.projectInfo.qualityLevel = "良";
            } else if (this.projectInfo.qualityScore >= 90) {
              this.projectInfo.qualityLevel = "优";
            }
            resolve(data.projectInfo);
          } else {
            this.$message.error(data.msg);
            reject(data.msg);
          }
        });
      });
    },
    // 获取项目的实体信息
    getEntityByProjectNo(projectNo) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(
            `/project/project/getByProjectNo/${projectNo}`
          ),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.id = data.project.id;
            this.dataForm.projectNo = data.project.projectNo;
            this.dataForm.examineNote = data.project.examineNote;
            resolve(this.examineNote);
          } else {
            this.$message.error(data.msg);
            reject(data.msg);
          }
        });
      });
    },
    // 提交项目审定
    saveForm() {
      if (this.dataForm.id == null || this.dataForm.id === "") {
        this.$message.error("当前项目不存在，请刷新后重试！");
        return;
      }
      this.$http({
        url: this.$http.adornUrl(`/project/project/authorize`),
        method: "post",
        data: this.$http.adornData({
          id: this.dataForm.id,
          projectNo: this.dataForm.projectNo,
          examineNote: this.dataForm.examineNote
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$notify({
            message: "提交成功",
            type: "success",
            duration: 1500
          });
          this.goBack();
        } else {
          this.$notify({
            message: data.msg,
            type: "danger",
            duration: 1500
          });
        }
      });
    },
    // 返回
    goBack() {
      this.$router.push({ name: "project-project" });
    }
  },
  watch: {
    $route: function(to, from) {
      this.projectNo = to.query["projectNo"];
      // 执行数据更新查询
      if (to.name === "project-editauthorize") {
        this.init();
      } else {
        this.goBack();
      }
    }
  }
};
</script>

<style scoped>
.shortcutstyle {
  width: 95%;
  margin: 0 auto;
  border: 1px dotted rgb(195, 197, 199);
  padding: 5px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 10px;
  overflow: scroll;
  height: 120px;
}
.fontspac {
  letter-spacing: 1.4px;
}
</style>
