<template>
  <div>
    <div  :style="'max-height: ' + (documentClientHeight - 150).toString() + 'px'"
          class="os">
      <div>
        <projectInfo :Info="projectInfo" :infotype="2" />
        <van-collapse :value="spShow" @change="spShowEvent" style="width:95%;margin:0 auto;">
          <van-collapse-item title="项目进度" name="1" class="InfoTitle">
            <van-row style="margin-top:2px;margin-bottom:8px;">
              <van-col span="8" style="text-align:center;">日期</van-col>
              <van-col span="8" style="text-align:center;">进度比率</van-col>
              <van-col span="8" style="text-align:center;">进度内容</van-col>
            </van-row>
            <van-list :key="index" v-for="(item, index) in  scheduleList">
              <van-row>
                <van-col span="8" style="text-align:center;">{{item.createTime}}</van-col>
                <van-col span="8" style="text-align:center;">{{item.scheduleRate}}</van-col>
                <van-col span="8" style="text-align:center;">{{item.scheduleNote}}</van-col>
              </van-row>
            </van-list>
          </van-collapse-item>
        </van-collapse>
        <van-form ref="dataForm" class="vf">
          <div class="vfs">
            <quickInput title="技术交底快捷输入" @vtrue="tdVisiable = true" />
            <van-field v-model="dataForm.technicalDisclosureNote" rows="5" autosize type="textarea" maxlength="1000" show-word-limit
              placeholder="请输入技术交底" :rules="[{ required: true, message: ' ' }]"/>
          </div>
          <div class="vfs">
            <quickInput title="过程检查意见快捷输入" @vtrue="piVisiable = true" />
            <van-field v-model="dataForm.checkSuggestion" rows="5" autosize type="textarea" maxlength="1000" show-word-limit
              placeholder="请输入过程检查意见" :rules="[{ required: true, message: ' ' }]"/>
          </div>
          <div class="vfs">
            <quickInput title="上交资料快捷输入快捷输入" @vtrue="siVisiable = true" />
            <van-field v-model="dataForm.dataName" rows="5" autosize type="textarea" maxlength="1000" show-word-limit
              placeholder="请输入上交资料快捷输入" :rules="[{ required: true, message: ' ' }]"/>
          </div>
          <div class="vfs">
            <quickInput title="工作小结快捷输入" @vtrue="swVisiable = true" />
            <van-field v-model="dataForm.briefSummary" rows="5" autosize type="textarea" maxlength="1000" show-word-limit
              placeholder="请输入工作小结快捷输入" :rules="[{ required: true, message: ' ' }]"/>
          </div>
          <div class="vfs">
            <quickInput title="工作量快捷输入" @vtrue="wlVisiable = true" />
            <van-field v-model="dataForm.workLoad" rows="5" autosize type="textarea" maxlength="1000" show-word-limit
              placeholder="请输入工作量快捷输入" :rules="[{ required: true, message: ' ' }]"/>
          </div>
        </van-form>
      </div>
    </div>

    <div class="foot">
      <van-row>
        <van-col span="12" style="text-align:center;">
          <van-button @click="goBack()" type="warning">返回</van-button>
        </van-col>
        <van-col span="12" style="text-align:center;">
          <van-button @click="dataFormSubmit" type="info">提交</van-button>
        </van-col>
      </van-row>
    </div>

    <van-popup v-model="tdVisiable" style="width: 85%;">
      <select-note title="技术交底快捷输入" v-model="dataForm" :dataList="disclosureNotesList" :selectType="4"
        @close="tdVisiable = false"/>
    </van-popup>
    <van-popup v-model="piVisiable" style="width: 85%;">
      <select-note title="过程检查意见快捷输入" v-model="dataForm" :dataList="checkSuggestionsList" :selectType="5"
        @close="piVisiable = false"/>
    </van-popup>
    <van-popup v-model="siVisiable" style="width: 85%;">
      <select-note title="上交资料快捷输入" v-model="dataForm" :dataList="dataNameList" :selectType="6"
        @close="siVisiable = false"/>
    </van-popup>
    <van-popup v-model="swVisiable" style="width: 85%;">
      <select-note title="上交资料快捷输入" v-model="dataForm" :dataList="briefSummarysList" :selectType="7"
        @close="swVisiable = false"/>
    </van-popup>
    <van-popup v-model="wlVisiable" style="width: 85%;">
      <select-note title="工作量快捷输入" v-model="dataForm" :dataList="workLoadList" :selectType="8"
        @close="wlVisiable = false"/>
    </van-popup>
  </div>
</template>

<script>
  import { closeTab } from "@/utils/tabs";
  import store from "@/store";
  import selectNote from "@/components/select-module/selectnote";
  import projectInfo from "@/components/projectinfo-module";
  import quickInput from "@/components/quickinput-module/quickinput.vue";
  export default {
    data () {
      return {
        // 技术交底弹框 标志
        tdVisiable: false,
        //过程检查弹框 标志
        piVisiable: false,
        //上交资料弹框 标志
        siVisiable: false,
        //工作小结弹框 标志
        swVisiable: false,
        //工作量弹框 标志
        wlVisiable: false,

        disclosureNotesList: [],
        checkSuggestionsList: [],
        dataNameList: [],
        briefSummarysList: [],
        workLoadList: [],

        panelShow: ["1"],
        spShow: ["1"],
        projectInfo: "",
        scheduleList: [], // 项目进度表

        disclosureValue: "",
        checkValue: "",
        dataValue: "",
        briefValue: "",
        workValue: "",
        dataForm: {
          technicalDisclosureNote: "",
          checkSuggestion: "",
          dataName: "",
          workLoad: "",
          briefSummary: ""
        }
      };
    },
    mounted() {
      this.init();
    },
    computed: {
      documentClientHeight: {
        get() {
          return this.$store.state.common.documentClientHeight;
        }
      }
    },
    components: {
      selectNote,
      projectInfo,
      quickInput
    },
    methods: {
      panelShowEvent() {
        if (this.panelShow.length == 1) {
          this.panelShow = [];
        } else {
          this.panelShow = ["1"];
        }
      },
      spShowEvent() {
        if (this.spShow.length == 1) {
          this.spShow = [];
        } else {
          this.spShow = ["1"];
        }
      },

      init() {
        let projectNo = this.$route.query.projectNo;
        this.getScheduleList(projectNo);
        this.getInfoByProjectNo(projectNo);
        this.getWorkByProjectNo(projectNo);
        this.getdisclosureNote();
        this.getcheckSuggestion();
        this.getdataName();
        this.getbriefSummary();
        this.getworkLoad();
      },
      // 获取进度列表
      getScheduleList(projectNo) {
        this.$http({
          url: this.$http.adornUrl("/project/schedule/list"),
          method: "get",
          params: this.$http.adornParams({
            projectNo: projectNo
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.scheduleList = data.list;
          } else {
            this.scheduleList = [];
          }
        });
      },
      // 获取项目工作
      getWorkByProjectNo(projectNo) {
        console.log(projectNo);
        return new Promise((resolve, reject) => {
          if (projectNo) {
            this.$http({
              url: this.$http.adornUrl(
                `/project/work/getInfoByProjectNo/${projectNo}`
              ),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                if (data.projectWork != null) {
                  this.dataForm.id = data.projectWork.id;
                  this.dataForm.projectNo = data.projectWork.projectNo;
                  this.dataForm.technicalDisclosureNote = data.projectWork.technicalDisclosureNote == null ? '' : data.projectWork.technicalDisclosureNote;
                  this.dataForm.checkSuggestion = data.projectWork.checkSuggestion == null ? '': data.projectWork.checkSuggestion;
                  this.dataForm.dataName = data.projectWork.dataName == null ? '': data.projectWork.dataName;
                  this.dataForm.briefSummary = data.projectWork.briefSummary == null ? '' : data.projectWork.briefSummary;
                  this.dataForm.workLoad = data.projectWork.workLoad == null ? '' : data.projectWork.workLoad;
                  this.dataForm.finishDateTime = data.projectWork.finishDateTime;
                  this.dataForm.projectStatus = data.projectWork.projectStatus;
                  this.dataForm.workNote = data.projectWork.workNote;
                  this.dataForm.planWorkDate = data.projectWork.planWorkDate;
                }
                resolve(data);
              } else {
                this.$message.error(data.msg);
                reject(data.msg);
              }
            });
          } else {
          }
        });
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
              data.projectInfo.executeStandard =
                "☑" +
                data.projectInfo.executeStandard.replace(/;/g, "☑").slice(0, -1);
              this.projectInfo = data.projectInfo;
              resolve(data.projectInfo);
            } else {
              this.$message.error(data.msg);
              reject(data.msg);
            }
          });
        });
      },

      // 获取技术交底列表
      getdisclosureNote() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/5`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.disclosureNotesList = data.list;
              resolve(data.list);
            } else {
              this.$message.error(data.msg);
              reject(data.msg);
            }
          });
        });
      },
      // 获取过程检查意见快捷数据
      getcheckSuggestion() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/6`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.checkSuggestionsList = data.list;
              resolve(data.list);
            } else {
              this.$message.error(data.msg);
              reject(data.msg);
            }
          });
        });
      },
      // 获取上交资料快捷数据
      getdataName() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/7`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataNameList = data.list;
              resolve(data.list);
            } else {
              this.$message.error(data.msg);
              reject(data.msg);
            }
          });
        });
      },
      // 获取工作小结快捷数据
      getbriefSummary() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/8`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.briefSummarysList = data.list;
              resolve(data.list);
            } else {
              this.$message.error(data.msg);
              reject(data.msg);
            }
          });
        });
      },
      // 获取工作量快捷数据
      getworkLoad() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/11`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.workLoadList = data.list;
              resolve(data.list);
            } else {
              this.$message.error(data.msg);
              reject(data.msg);
            }
          });
        });
      },

      // 表单提交
      dataFormSubmit() {
        this.$refs.dataForm.validateAll().then(success => {
          this.$http({
            url: this.$http.adornUrl(
              `/project/work/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              projectNo: this.dataForm.projectNo,
              technicalDisclosureNote: this.dataForm.technicalDisclosureNote,
              checkSuggestion: this.dataForm.checkSuggestion,
              dataName: this.dataForm.dataName,
              briefSummary: this.dataForm.briefSummary,
              workLoad: this.dataForm.workLoad
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$notify({ type: 'success', message: '操作成功',duration: 2500})
              this.goBack();
            } else {
              this.$notify({message: data.msg, type: 'danger',duration: 2500})
            }
          });
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
        if (to.name === "project-editwork") {
          this.init();
        } else {
          router.push({ name: mainTabs[mainTabs.length - 1].name });
        }
      }
    }
  };
</script>

<style>
  .InfoTitle .van-cell__title:nth-child(1) {
    font-size: 16px;
  }
  .InfoTitle .van-collapse-item__content {
    color: #1a1b1c;
    padding: 0 10px;
  }
  .vf .vfs .van-cell {
    width: 80%;
    margin: 0 auto;
    border: 1px dashed #d9d2d2;
    padding: 0px;
    border-radius: 5px;
  }
  .talfs {
    text-align: left;
    font-size: 16px;
  }
  .mt15 {
    margin-top: 15px;
  }
  .frmr30 {
    float: right;
    margin-right: 30px;
  }
  .ml30 {
    margin-left: 30px;
  }
  .os{
    overflow:scroll;
  }
  .foot {
    justify-content: space-around;
    position: fixed;
    width:100%;
    bottom: 5%;
    z-index: 0;
    color: whitesmoke;
    padding: 1px;
  }
</style>
