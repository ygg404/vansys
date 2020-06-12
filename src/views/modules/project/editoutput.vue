<template>
  <div>
    <div :style="'max-height: ' + (documentClientHeight - 150).toString() + 'px'" class="os">
      <div>
        <projectInfo :Info="projectInfo" :infotype="5" />
        <div class="pibd">
          <div class="mbml4" style="margin-top:4px;">预计工作量：{{projectInfo.projectWorkload}}</div>
          <div class="mbml4">作业工作量：{{projectInfo.workLoad}}</div>
          <div class="mbml4">预计总产值：{{projectInfo.projectOutput}}</div>
          <div class="mbml4" style="color: #00b7ee">实际总产值：{{totalOutPut}}</div>
        </div>

        <div class="seller">
          <van-row class="cots">
            <van-col span="5" />
            <van-col span="14">
              <van-cell title="结算时间" :value="cutOffTime" @click="stShow = true" />
            </van-col>
            <van-col span="5" />
          </van-row>
          <van-popup v-model="stShow" position="bottom">
            <van-datetime-picker
              v-model="cutOffTimeDate"
              type="year-month"
              title="选择时间"
              :min-date="minDate"
              :max-date="maxDate"
              :formatter="formatter"
              @cancel="stShow = false"
              @confirm="confirmPicker"
            />
          </van-popup>
        </div>


        <div class="psts">
          <van-cell is-link @click="pstVisible = true">
            <template solt="title">项目类型</template>
            <template solt="default">
              <van-tag
                style="margin-left:10px;"
                plain
                type="primary"
                v-if="this.selectedTypeName != '' "
              >{{selectedTypeName}}</van-tag>
              <van-tag
                plain
                type="primary"
                v-if="this.selectedTypeNum >= 1"
                style="margin-left:5px;"
              >+{{selectedTypeNum}}</van-tag>
            </template>
          </van-cell>
        </div>

        <div class="xmlx">
          <div
            :key="index"
            v-for="(workType, index) in leftData"
            style="margin-top:3px;margin-bottom:3px;"
          >
            <van-checkbox v-if="workType.isVisible && workType.listIndex == groupradio" v-model="workType.checked" @change="checkOutputVoInit" shape="square">{{workType.typeName}}</van-checkbox>
          </div>
        </div>

        <div style="overflow:scroll; width:100%; max-height:250px;margin-top:20px;">
          <van-radio-group v-model="groupradio" @change="changegroupradio">
            <div :key="index" v-for="(groupOutput,index) in outPutGroupList">
              <div v-if="groupOutput.checked">
                <van-radio :name="groupOutput.groupId">
                  <span class="group_card">{{groupOutput.groupName}}</span>
                  <span>(队长：{{groupOutput.headMan}})</span>
                  <span v-if="groupOutput.headMan == projectInfo.projectCharge" style="color: red">(项目负责人)</span>
                </van-radio>
                <van-row class="mbb">
                  <van-col span="6" class="tac">产值单位</van-col>
                  <van-col span="6" class="tac">难度系数</van-col>
                  <van-col span="6" class="tac">工作量</van-col>
                  <van-col span="6" class="tac">产值</van-col>
                </van-row>
                <div>
                  <van-list :key="index" class="projectgroupliststyle" v-for="(item,index) in chooseRatio(groupOutput.checkOutputVoList)" style="padding-left:5%;padding-right:5%;">
                    <div style="border-bottom: 1px solid rgb(195, 197, 199);">
                      <van-row type="flex" align="center" justify="center" style="margin-top:2px;margin-bottom:5px;">
                        <van-col span="12" class="tac">{{item.typeName}}</van-col>
                        <van-col span="12" class="tac">{{item.unit}}</van-col>
                      </van-row>
                      <van-row type="flex" align="center" justify="center" style="margin-bottom:5px;">
                        <van-col span="6" class="tac">{{item.unitOutput}}</van-col>
                        <van-col span="6">
                          <div class="numinputstyle" style="width:80%;">
                            <van-field v-model="item.projectRatio" @change="checkOutputVoInit" />
                          </div>
                        </van-col>
                        <van-col span="6">
                          <div class="numinputstyle" style="width:80%;">
                            <van-field v-model="item.workLoad" @change="checkOutputVoInit" />
                          </div>
                        </van-col>
                        <van-col span="6" class="tac">{{item.typeOutput}}</van-col>
                      </van-row>
                    </div>
                  </van-list>
                </div>
              </div>
            </div>
          </van-radio-group>
        </div>
      </div>
    </div>
    <div style="margin-top:20px;">
      <van-row type="flex" justify="space-around" align="center">
        <van-col span="10">
          <div style="text-align:center; width:100%;height:100%;margin:0px; ">
            <van-button @click="goBack()" type="warning">返回</van-button>
          </div>
        </van-col>
        <van-col span="10">
          <div style="text-align:center; width:100%;height:100%;margin:0px; ">
            <van-button @click="saveForm" type="info">提交</van-button>
          </div>
        </van-col>
      </van-row>
    </div>

    <van-popup v-model="pstVisible" style="width: 85%;">
      <div>
        <div class="header">项目类型</div>
        <div class="check_group">
          <van-checkbox-group v-model="ptValue">
            <van-checkbox
              v-for="item in projectTypelist"
              :key="item.id"
              :name="item.id"
              style="padding: 5px;"
              shape
            >{{item.name}}</van-checkbox>
          </van-checkbox-group>
        </div>
        <div class="btn_bottom">
          <van-button plain @click="pstVisible = false">取消</van-button>
          <van-button type="info" @click="projectTypeChangeHandler()">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import moment from  'moment'
import { Divider } from 'vant'
import store from '@/store'
import projectInfo from '@/components/projectinfo-module'
export default {
  data () {
    return {
      // 折叠面板
      panelShow: ['1'],
      projectStarttDatedata: '',
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2025, 10, 1),
      stShow: false,
      pstVisible: false,
      projectStarttDateshow: false,
      // 项目类型相关数据回显
      selectedTypeName: '',
      selectedTypeNum: 0,
      loading: true,
      groupradio: 0,
      totalOutPut: 0, // 实际总产值
      leftData: [], // 左侧数据显示
      projectNo: '',
      projectInfo: '',
      projectTypelist: [], // 项目类型列表
      ptValue: [],
      workTypelist: [], // 工作类型列表
      outPutGroupList: [],
      qualityNoteValue: '',
      cutOffTime: '',
      cutOffTimeDate: new Date()
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    $route: function (to, from) {
      this.projectNo = to.query['projectNo']
      // 执行数据更新查询
      if (to.name === 'project-editoutput') {
        this.init()
      } else {
        router.push({ name: mainTabs[mainTabs.length - 1].name });
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
  components: {
    projectInfo
  },
  methods: {
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    confirmPicker (val) {
      this.cutOffTime = `${val.getFullYear()}-${val.getMonth() + 1}`
      this.stShow = false;
    },
    panelShowEvent () {
      if (this.panelShow.length === 1) {
        this.panelShow = []
      } else {
        this.panelShow = ['1']
      }
    },
    // Date 转化为 String
    formatDate (date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    // 日期控件弹窗
    cutOffTimeConfirm () {
      this.projectStarttDateshow = true
    },
    // 修改组选项
    changegroupradio (event) {
      this.groupradio = event
    },
    init () {
      this.projectNo = this.$route.query.projectNo
      this.getCutoffTime()
      this.getInfoByProjectNo(this.projectNo).then(success => {
        this.getProjectTypelist().then(success => {
          this.getWorkTypelist().then(success => {
            let ptType = this.projectInfo.projectType.split(',')
            if (ptType.length >= 0) {
              this.selectedTypeName = ptType[0]
              this.selectedTypeNum = ptType.length - 1
            }
            console.log(ptType)
            for (let pt of this.projectTypelist) {
              for (let type of ptType) {
                if (pt.name === type) {
                  this.ptValue.push(pt.id)
                }
              }
            }
            this.workTypeInit()
            this.getOutPutGroupList(this.projectNo).then(success => {
              // 默认选中第一个组
              for (let e of this.outPutGroupList) {
                if (e.checked) {
                  this.groupradio = e.groupId
                  break;
                }
              }
              this.checkOutputVoInit()
              this.loading = false
              this.projectStarttDatedata = this.cutOffTime
            })
          })
        })
      })
    },
    // 工作类型可见或不可见
    workTypeInit () {
      for (let workType of this.workTypelist) {
        workType.isVisible = false
        // 工作类型 不属于 任意项目则设为 可见
        if (workType.projectTypeIdList.length === 0) {
          workType.isVisible = true
        } else {
          for (let ptypeId of workType.projectTypeIdList) {
            for (let ptvalue of this.ptValue) {
              if (ptvalue === ptypeId) workType.isVisible = true
            }
          }
        }
      }
    },
    // 根据工作类型可见不可见 来显示右侧工作组工作类型数据
    checkOutputVoInit () {
      this.leftData = []
      this.totalOutPut = 0
      this.outPutGroupList.forEach((e, index) => {
        if (e.checked) {
          e.projectActuallyOutput = 0
          e.checkOutputVoList.forEach(ele => {
            // 各组工作类型产值
            ele.typeOutput = 0
            ele.typeOutput = parseFloat(
              (ele.projectRatio * ele.unitOutput * ele.workLoad).toFixed(2)
            )
            if (ele.checked)
              e.projectActuallyOutput = parseFloat(
                (e.projectActuallyOutput + ele.typeOutput).toFixed(2)
              )
            ele.isVisible = false
            this.workTypelist.forEach((work, index) => {
              if(work.id === ele.typeId && work.isVisible)
                ele.isVisible = true
            })
            ele.listIndex = e.groupId
          })
          this.leftData = this.leftData.concat(e.checkOutputVoList)
          this.totalOutPut = parseFloat(
            (this.totalOutPut + e.projectActuallyOutput).toFixed(2)
          )
        }
      })
      console.log(this.leftData)
    },
    // 获取工作组的产值核算
    getOutPutGroupList (projectNo) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/project/checkoutput/getOutPutGroup`),
          method: 'get',
          params: this.$http.adornParams({
            projectNo: projectNo
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.outPutGroupList = data.list
            resolve(data.list)
          } else {
            this.$message.error(data.msg)
            reject(data.msg)
          }
        })
      })
    },
    // 获取结算时间
    getCutoffTime () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/project/quality/getInfo`),
          method: 'get',
          params: this.$http.adornParams({
            projectNo: this.projectNo
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            if (data.checkQuality != null) {
              this.cutOffTime = data.checkQuality.cutOffTime
              this.cutOffTimeDate = new Date(this.cutOffTime)
            }
            resolve(data.checkQuality)
          } else {
            this.$message.error(data.msg)
            reject(data.msg)
          }
        })
      })
    },
    // 获取项目基本信息
    getInfoByProjectNo (projectNo) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/project/projectInfo/info/${projectNo}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
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
    // 获取项目类型列表
    getProjectTypelist () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/set/projecttype/getProjectTypelist`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.projectTypelist = []
            this.projectTypelist.push({ id: 0, name: '全部' })
            console.log(this.projectTypelist)
            for (let item of data.list) {
              this.projectTypelist.push({ id: item.id, name: item.name })
            }
            resolve(data.projectTypelist)
          } else {
            this.$message.error(data.msg)
            reject(data.msg)
          }
        })
      })
    },
    // 获取工作类型列表
    getWorkTypelist () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/set/worktype/getList`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.workTypelist = data.list
            resolve(data.workTypelist)
          } else {
            this.$message.error(data.msg)
            reject(data.msg)
          }
        })
      })
    },
    // 提交结算时间
    postCutoffTimeToApi () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/project/quality/cutOffTimesave`),
          method: 'post',
          data: this.$http.adornData({
            projectNo: this.projectNo,
            cutOffTime: this.cutOffTime
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            resolve(data)
          } else {
            this.$message.error(data.msg)
            reject(data.msg)
          }
        })
      })
    },
    // 保存产值核算
    postOutputToApi () {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl(`/project/checkoutput/save`),
        method: 'post',
        data: this.$http.adornData({
          projectNo: this.projectNo,
          pgroupList: this.outPutGroupList,
          projectActuallyOutput: this.totalOutPut
        })
      }).then(({ data }) => {
        this.loading = false
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
          this.visible = false
          this.$emit('refreshDataList')
          this.goBack()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    saveForm () {
      this.postCutoffTimeToApi().then(success => {
        this.postOutputToApi()
      })
    },
    // 项目类型改变
    projectTypeChangeHandler () {
      console.log(this.ptValue)
      // 取出第一个名称回显
      if (this.ptValue.length !== 0) {
        this.selectedTypeName = this.projectTypelist[this.ptValue[0]].name
      }
      // 回显项目类型数量
      this.selectedTypeNum = this.ptValue.length - 1
      for (let ptvalue of this.ptValue) {
        // 全选情况下
        if (ptvalue === 0) {
          this.ptValue = []
          this.selectedTypeName = this.projectTypelist[1].name
          this.selectedTypeNum = this.projectTypelist.length - 2
          for(var pw of this.projectTypelist)
            if (pw.id !== 0) {
              this.ptValue.push(pw.id)
            }
          break
        }
      }
      this.workTypeInit()
      this.checkOutputVoInit()
      this.pstVisible = false
    },
    // 保留小数点后两位的过滤器，尾数不四舍五入
    numFilter (value) {
      // 截取当前数据到小数点后三位
      let tempVal = parseFloat(value).toFixed(3)
      let realVal = tempVal.substring(0, tempVal.length - 1)
      return realVal
    },
    // 工作类型在表格勾选显示
    chooseRatio (params) {
      //  console.log(params)
      let temp = []
      params.forEach(e => {
        if (e.checked) {
          e.typeOut = this.numFilter(
            e.workLoad * e.projectRatio * e.typeOutput
          )
          if (e.projectRatio == null || e.workLoad == null) {
            e.projectRatio = 1
            e.workLoad = 0
          }
          temp.push(e)
        }
      })
      return temp
    },
    // 返回
    goBack () {
      this.$router.push({ name: 'project-project' })
    }
  }
}
</script>

<style>
  .header {
    padding-top:10px;
    font-size: 17px;
    font-weight: 700;
    text-align: center;
    line-height:17px;
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
.projectstartrow .van-cell {
  padding: 0;
}
.xmlx {
  margin-left: 1%;
  margin-right: 1px;
  overflow: scroll;
  width: 98%;
  max-height: 200px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(195, 197, 199);
}
.execbtn {
  font-size: 13px;
  background: #fff;
  color: #777777;
  line-height: 20px;
  flex: 1;
  border: 0;
  height: 20px;
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
.shortcutstyleminheight {
  height: 60px;
}
.fontspac {
  letter-spacing: 1.4px;
}
.addsubbtnstyle {
  background-color: #fff;
  border: 1px solid #c0b7b7;
  color: #c0b7b7;
  border-radius: 7px;
  width: 20px;
  height: 18px;
}
.numInputstyle {
  height: 20px;
  padding: 0;
  border: 1px solid #c0b7b7;
  border-radius: 5px;
}
.deOutputStyle .van-col {
  font-size: 13px;
}
.workTypedetailStyle .van-grid-item__content {
  padding: 4px;
  font-size: 13px;
}
.workgroupdatastyle .van-divider {
  margin: 5px 0;
}
.selectworkgroupstyle .van-button {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  height: 30px;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
}

.chooseworkgroupstyle .van-button {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  height: 35px;
  margin: 0;
  padding: 0;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
}

.worktypeStyle .van-checkbox__icon {
  font-size: 18px;
}
.worktypeStyle .van-dialog {
  font-size: 14px;
}
.worktypeStyle .van-checkbox {
  margin-bottom: 5px;
}
.worktypeStyle .van-checkbox__label {
  line-height: 0px;
}
.numinputstyle .van-field__control {
  border: 1px solid #cfcfcc;
}
.numtitleNamestyle .van-dialog {
  font-size: 14px;
}
.typeunitstyle {
  font-size: 14px;
}
.numinputstyle .van-cell {
  padding: 0px;
}
.selectworkgroupstyle .van-dialog__footer--buttons {
  display: none;
}

.InfoTitle .van-cell__title:nth-child(1) {
  font-size: 16px;
}
.InfoTitle .van-collapse-item__content {
  color: #1a1b1c;
  padding: 0 10px;
}
.seller .van-cell__title span {
  font-size: 16px;
}
.mbml4 {
  margin-bottom: 5px;
  margin-left: 4px;
}

.pibd {
  width: 90%;
  margin: 0 auto;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 1px dotted rgb(195, 197, 199);
}
.os {
  overflow: scroll;
}
.cots .van-cell {
  font-size: 16px;
  border: 1px dotted rgb(195, 197, 199);
}
.tac {
  text-align: center;
}
.mbb {
  margin-top: 2px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgb(195, 197, 199);
}
</style>
