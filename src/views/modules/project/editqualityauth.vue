<template>
  <div class="mod-config">
    <projectInfo :Info="projectInfo" :infotype="4" />
    <van-collapse :value="panelRShow" @change="panelRShowEvent" style="width:95%;margin:0 auto;">
      <van-collapse-item title="返修记录信息" name="1" class="InfoTitle">
        <van-row class="mtptpbbb1">
          <van-col span="8" class="tac">返修日期</van-col>
          <van-col span="8" class="tac">返修要求</van-col>
          <van-col span="8" class="tac">修改日期</van-col>
        </van-row>
         <van-list :key="index" v-for="(item, index) in backWorkList" style="margin-top:5px;" v-if="backWorkList.length !== 0">
           <van-row>
             <van-col span="8" class="tac">{{item.backCreateTime}}</van-col>
             <van-col span="8" class="scbtn">
               <van-button type="info" icon="search" @click="checkReportHandle(item)">查看内容</van-button>
             </van-col>
             <van-col span="8" class="tac">{{item.submitCreateTime}}</van-col>
           </van-row>
         </van-list>
      </van-collapse-item>
    </van-collapse>

    <van-collapse
      :value="panelQIFShow"
      @change="panelQIFShowEvent"
      style="width:95%;margin:0 auto;"
    >
      <van-collapse-item title="质检反馈报告" name="1" class="InfoTitle">
        <div ref="reportId"></div>
      </van-collapse-item>
    </van-collapse>

    <van-form ref="dataForm" class="vf">
      <div class="vfs">
        <quickInput title="质量综述短语快捷输入" @vtrue="esVisible = true" />
        <van-field
          v-model="dataForm.qualityNote"
          rows="5"
          autosize
          type="textarea"
          maxlength="1000"
          show-word-limit
          placeholder="请输入质量综述"
          :rules="[{ required: true, message: ' ' }]"
        />
      </div>
    </van-form>

    <van-popup v-model="esVisible" style="width: 85%;">
      <select-note
        title="质量综述快捷输入"
        v-model="dataForm"
        :dataList="qualityNotelist"
        :selectType="9"
        @close="esVisible = false"
      />
    </van-popup>

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
import projectInfo from "@/components/projectinfo-module";
import selectNote from "@/components/select-module/selectnote";
import quickInput from "@/components/quickinput-module/quickinput.vue";
export default {
  data() {
    return {
      panelPShow: ["1"],
      panelRShow: ["1"],
      panelQIFShow: ["1"],
      esVisible: false,

      proLoading: false,
      curRate: 0,
      curprog: 0,
      totalprog: 1,
      dataLoading: false,
      loadingText: "正在加载...",
      projectNo: "",
      reportVisible: false,
      reportTitle: "",
      isCheck: 0, // 检查状态： 2为返修中
      projectInfo: "",
      qualityNotelist: [],
      qualityNoteValue: "",
      qualityScoreVisible: false, // 质检分数可视图
      repairVisible: false, // 返修可视图
      editVisible: false, // 编辑质检报告可视图
      backWorkList: [],
      activeNames: [],
      dataForm: {
        id: "",
        qualityNote: "" // 质检综述
      },
      dataRule: {
        qualityNote: [
          { required: true, message: "质量综述不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  components: {
    projectInfo,
    selectNote,
    quickInput
  },

  methods: {
    panelPShowEvent() {
      if (this.panelPShow.length == 1) {
        this.panelPShow = [];
      } else {
        this.panelPShow = ["1"];
      }
    },
    panelRShowEvent() {
      if (this.panelRShow.length == 1) {
        this.panelRShow = [];
      } else {
        this.panelRShow = ["1"];
      }
    },
    panelQIFShowEvent() {
      if (this.panelQIFShow.length == 1) {
        this.panelQIFShow = [];
      } else {
        this.panelQIFShow = ["1"];
      }
    },

    init() {
      this.projectNo = this.$route.query.projectNo;
      this.getInfoByProjectNo(this.projectNo);
      this.dataLoading = true
      this.loadingText = ""
      this.getQualityByProjectNo(this.projectNo).then(data => {
        this.dataLoading = false
      });
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
              url: this.$http.adornUrl(`/project/quality/update`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'projectNo': this.projectNo,
                'qualityNote': this.dataForm.qualityNote
              }),
              onUploadProgress (proEvent) {
                that.loadingText = '正在上传中（' + parseInt(proEvent.loaded * 100 / proEvent.total).toString() + '%)'
              }
            }).then(({data}) => {
              if (data && data.code === 0) {
                that.dataLoading = false
                this.$notify({
                message: '操作成功',
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
      );

    },
    // 查看质检反馈内容
    checkReportHandle(item) {
      this.reportVisible = true;
      this.reportTitle = "质检反馈报告（ 日期：" + item.backCreateTime + ")";
      this.curprog = 0;
      this.$refs.reportPreId.innerHTML = item.backNote;
    },
    // 返修列表关闭事件
    reportDialogClose() {
      this.reportVisible = false;
      this.visible = false;
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
            resolve(data.projectInfo);
          } else {
            this.$message.error(data.msg);
            reject(data.msg);
          }
        });
      });
    },
    // 获取质检信息
    getQualityByProjectNo(projectNo) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/project/quality/getInfo`),
          method: "get",
          params: this.$http.adornParams({
            projectNo: projectNo
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            if (data.checkQuality != null) {
              this.dataForm.id = data.checkQuality.id;
              this.dataForm.qualityNote = data.checkQuality.qualityNote;
              this.dataForm.qualityScore = data.checkQuality.qualityScore;
              this.dataForm.qualityReport = data.checkQuality.qualityReport;
              this.$refs.reportId.innerHTML = data.checkQuality.qualityReport;
            }
            resolve(data);
          } else {
            this.$message.error(data.msg);
            reject(data.msg);
          }
        });
      });
    },
    // 获取返修内容列表
    getBackworkHandle(projectNo) {
      this.$http({
        url: this.$http.adornUrl(`/project/backwork/list/${projectNo}`),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.backWorkList = data.list;
        } else {
          this.backWorkList = [];
        }
      });
    },
    // 获取质量综述列表
    getQualityNotelist() {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/9`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.qualityNotelist = data.list;
            resolve(data.list);
          } else {
            this.$message.error(data.msg);
            reject(data.msg);
          }
        });
      });
    },
    // 获取返修综述列表
    getRepairNotelist() {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/12`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.repairNotelist = data.list;
            resolve(data.list);
          } else {
            this.$message.error(data.msg);
            reject(data.msg);
          }
        });
      });
    },

    // 返回
    goBack() {
      // closeTab('project-editqualityquth')
      this.$router.push("project-project");
    }
  },
  watch: {
    $route: function(to, from) {
      this.projectNo = to.query["projectNo"];
      // 执行数据更新查询
      if (to.name === "project-editqualityquth") {
        this.init();
      } else {
        closeTab("project-editqualityauth");
      }
    },
    activeNames: function(val) {
      if (val.indexOf("preReport") !== -1) {
        this.reportVisible = false;
        this.proLoading = false;
        this.$refs.reportPreId.innerHTML = "";
      }
    }
  }
};
</script>

<style scoped>
.form_class {
  margin-top: 20px;
}

.span_title {
  font-size: 18px;
  font-weight: 700;
}
.span_title :hover {
  color: #00a0e9;
}

.bottom_btn {
  margin: 20px;
  width: 100%;
  text-align: center;
}
.quality_title {
  padding: 0;
  justify-content: space-between;
  display: flex;
}

.col_item .el-collapse-item__header focusing is-active {
  border-bottom: 1px solid #2d64b3;
}

.back_title {
  color: #00a0e9;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #00a0e93f;
}
.quality_card {
  margin-top: 15px;
}
.quality_card .quality_card_title {
  font-weight: 700;
  font-size: 13pt;
  border-bottom: 1px solid #00a0e93f;
}
.quality_report {
  overflow: auto;
  padding: 8px;
}

.anim_not_view {
  opacity: 0;
}
/* 下拉动画 */
.anim_report_view {
  display: block;
  animation: 2s report_view 0s;
}

@keyframes report_view {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}

.loading_clss {
  width: 100%;
  text-align: center;
  background-color: #6f71805f;
  opacity: 0.8;
}

.card_header {
  margin-top: 18px;
}
.card_header .header_span {
  font-weight: 700;
  font-size: 14pt;
}

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
.scbtn .van-button--normal {
  padding: 0 6px;
}
.scbtn .van-button {
  height: 30px;
}
.tac {
  text-align: center;
}
.talfs{
text-align:left;font-size:16px;
}
.mt15{
margin-top:15px;
}
.frmr30{
float:right;margin-right:30px;
}
.mtptpbbb1{
margin-top:2px;padding-top:5px;padding-bottom:5px;border-bottom: 1px solid rgb(195, 197, 199);
}
.vf .vfs .van-cell {
  width: 80%;
  margin: 0 auto;
  border: 1px dashed #d9d2d2;
  padding: 0px;
  border-radius: 5px;
}
</style>
