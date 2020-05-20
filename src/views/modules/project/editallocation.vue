<template>
  <div>
    <div :style="'max-height: ' + (documentClientHeight - 150).toString() + 'px'" class="os">
      <projectInfo :Info="projectInfo" :infotype="1"/>
      <van-row class="wmrml">
        <van-row class="wgds">
          <van-col span="12" class="talfspl">作业组数据</van-col>
          <van-col span="12" class="tarfspr">负责人:{{dataForm.projectCharge}}</van-col>
        </van-row>
        <van-row v-if="dataForm.projectCharge != null" class="mlmrmtwhbb">
          <div v-for="group in this.groupWorkList" :key="group.groupId">
            <div
              v-if="group.checked"
              class="groupitem"
            >
              {{group.groupName}}:占比{{group.outputRate}}%，产值:{{group.projectOutput}}，最短工期:{{group.shortDateTime}}，最长工期:{{group.lastDateTime}}
            </div>
          </div>
        </van-row>
      </van-row>

      <van-form ref="dataForm" class="vf">
        <!---->
        <van-row type="flex" align="center" justify="center">
          <van-col span="15">
            <van-field
              v-model="dataForm.projectBegunDateTime"
              label="开工日期"
              placeholder="开工日期"
              readonly
              @click="datePickerShow = true"
            />
          </van-col>
        </van-row>
        <van-calendar
          v-model="datePickerShow"
          :default-date="dataForm.projectBegunDateTime == ''?new Date(): new Date(dataForm.projectBegunDateTime)"
          :min-date="new Date(2010,0,1)"
          :max-date="new Date(2050,11,31)"
          @confirm="onDateConfirm"
          color="#1989fa"
        />
        <!---->
        <div class="vfs">
          <quickInput title="执行标准短语快捷输入" @vtrue="esVisiable = true"/>
          <van-field
            v-model="dataForm.executeStandard"
            rows="5"
            autosize
            type="textarea"
            maxlength="1000"
            show-word-limit
            placeholder="请输入执行标准"
            :rules="[{ required: true, message: ' ' }]"
          />
        </div>
        <div class="vfs">
          <quickInput title="作业内容短语快捷输入" @vtrue="wnVisiable = true"/>
          <van-field
            v-model="dataForm.workNote"
            rows="5"
            autosize
            type="textarea"
            maxlength="1000"
            show-word-limit
            placeholder="请输入作业内容"
            :rules="[{ required: true, message: ' ' }]"
          />
        </div>
        <div class="vfs">
          <quickInput title="作业要求短语快捷输入" @vtrue="wrVisiable = true"/>
          <van-field
            v-model="dataForm.workRequire"
            rows="5"
            autosize
            type="textarea"
            maxlength="1000"
            show-word-limit
            placeholder="请输入作业要求"
            :rules="[{ required: true, message: ' ' }]"
          />
        </div>

        <van-row type="flex" justify="center" align="center">
          <van-col span="12">
            <div class="ccl">
              <van-field
                @change="countWorkDateHandler"
                v-model="dataForm.projectOutput"
                label="预计产值"
                type="number"
                :rules="[{ required: true, message: '预计产值不能为空' }]"
              />
              <van-field
                v-model="dataForm.projectWorkDate"
                label="作业工期"
                type="number"
                :rules="[{ required: true, message: '作业工期不能为空' }]"
              />
              <van-field
                v-model="dataForm.projectQualityDate"
                label="预计产值"
                type="number"
                :rules="[{ required: true, message: '预计产值不能为空' }]"
              />
            </div>
          </van-col>
          <van-col span="8" class="pobtn">
            <van-button type="info" @click="setProjectOutputHandle()">产值明细计算</van-button>
          </van-col>
        </van-row>

        <van-row type="flex" justify="center" align="center" class="mtmb10">
          <van-col span="8" class="pobtn">
            <van-button type="info" @click="projectGroupHandle(projectNo)">选择作业组</van-button>
          </van-col>
        </van-row>
      </van-form>

      <!--产值明细计算弹出框-->
      <van-dialog
        v-model="outputCalVisible"
        title="产值明细计算"
        show-cancel-button
        @cancel="outputCalVisible = false"
        @confirm="putProjectOutputToApiHandle"
      >
        <div style="overflow:scroll; width:100%; height:500px;">
          <div class="psts">
            <van-cell is-link @click="pstVisible = true">
              <template solt="title">项目类型</template>
              <template solt="default">
                <van-tag
                  style="margin-left:10px;"
                  plain
                  type="primary"
                  v-if="this.selectedTypeName != '' "
                >{{selectedTypeName}}
                </van-tag>
                <van-tag
                  plain
                  type="primary"
                  v-if="this.selectedTypeNum >= 1"
                  style="margin-left:5px;"
                >+{{selectedTypeNum}}
                </van-tag>
              </template>
            </van-cell>
          </div>

          <!---->
          <div class="ptsd" v-if="workTypelist">
            <van-list :key="workType + index" v-for="(workType, index) in  workTypelist">
              <van-checkbox
                v-model="workType.checked"
                v-if="workType.isVisible"
                size="large"
                @change="checkOutputVoInit"
                shape="square"
                style="margin-bottom:5px;"
              >{{workType.typeName}}
              </van-checkbox>
            </van-list>
          </div>
          <!---->
          <div class="mbmt5">
            <span class="fsml">预计总产值：{{totalOutPut}}</span>
          </div>
          <van-row class="ptsdv">
            <van-col span="6" class="tac">产值单位</van-col>
            <van-col span="6" class="tac">难度系数</van-col>
            <van-col span="6" class="tac">工作量</van-col>
            <van-col span="6" class="tac">产值</van-col>
          </van-row>
          <div>
            <van-list :key="item.id + index" v-for="(item,index) in chooseRatio(workTypelist)">
              <van-row>
                <van-col>
                  <van-row type="flex" align="center" justify="center" class="pglsfirst">
                    <van-col span="16" style="padding:4px;">{{item.typeName}}</van-col>
                    <van-col span="8">
                      <van-row type="flex" align="center" justify="center">
                        <van-col>{{item.unit}}</van-col>
                      </van-row>
                    </van-col>
                  </van-row>
                  <div class="whdfaic">
                    <div class="w25fl">
                      <div class="nis">{{item.unitOutput}}</div>
                    </div>
                    <div class="w25fl">
                      <div class="nis">
                        <van-field v-model="item.projectRatio" @change="checkOutputVoInit"/>
                      </div>
                    </div>
                    <div class="w25fl">
                      <div class="nis">
                        <van-field v-model="item.workLoad" @change="checkOutputVoInit"/>
                      </div>
                    </div>
                    <div class="w25fl">
                      <div class="nis">{{item.typeOutput}}</div>
                    </div>
                  </div>
                </van-col>
              </van-row>
            </van-list>
          </div>
          <!---->
          <div style="margin-left:10%;margin-bottom:10px;">备注填写</div>

          <textarea class="tas" v-model="projectInfo.outputRemark"/>
          <!---->
        </div>
      </van-dialog>

      <!---->
      <van-row class="wptpbfpl">预计产值明细 (预计总产值：{{totalOutPut}})</van-row>
      <van-row class="pt10mt5mb8bt1">
        <van-col span="4" class="tc">作业类型</van-col>
        <van-col span="4" class="tc">量单位</van-col>
        <van-col span="4" class="tc">产值单位</van-col>
        <van-col span="4" class="tc">难度系数</van-col>
        <van-col span="4" class="tc">工作量</van-col>
        <van-col span="4" class="tc">产值</van-col>
      </van-row>
      <van-row class="whmlmr">
        <div class="pbpt" :key="index" v-for="(item,index) in chooseRatio(workTypelist)">
          <van-row>
            <van-col span="4" class="tc">{{item.typeName}}</van-col>
            <van-col span="4" class="tc">{{item.unit}}</van-col>
            <van-col span="4" class="tc">{{item.unitOutput}}</van-col>
            <van-col span="4" class="tc">{{item.projectRatio}}</van-col>
            <van-col span="4" class="tc">{{item.workLoad}}</van-col>
            <van-col span="4" class="tc">{{item.typeOutput}}</van-col>
          </van-row>
        </div>
      </van-row>
      <!--备注-->
      <van-row  style="padding-top:10px;padding-botom:10px;margin-top:10px;margin-bottom:10px;border-bottom:1px solid rgb(195, 197, 199);" v-if="projectInfo.outputRemark != '' && projectInfo.outputRemark != null">
        <van-col span="5" class="tac" style="font-weight: 700;">备注</van-col>
        <van-col style="color: #00b7ee;"span="10">{{projectInfo.outputRemark}}</van-col>
      </van-row>
      <!---->

      <!--分割线-->
      <van-row class="zywwt">
        <van-col span="6" class="tc">组名</van-col>
        <van-col span="6">已安排产值</van-col>
        <van-col span="6">未完成产值</van-col>
        <van-col span="6">未完成项目数</van-col>
      </van-row>

      <div :key="indexA" v-for="(itemA,indexA) in groupRateList" class="mmb">
        <van-collapse :value="saList[indexA].sollapseactive" @change="grisEvent(indexA)" class="vc">
          <van-collapse-item name="1">
            <van-row slot="title">
              <van-col span="7">{{itemA.groupName}}</van-col>
              <van-col span="6">{{itemA.isSetOutput}}</van-col>
              <van-col span="6">{{itemA.isNotOutput}}</van-col>
              <van-col span="5">{{itemA.undoneNum}}</van-col>
            </van-row>
            //  这里需要修改
            <div :key="indexB"  v-for="(itemB,indexB) in itemA.projectList" class="bbs">
              <van-row type="flex" justify="space-around" class="ptpb">
                <van-col span="10">
                  <div class="plpr">{{itemB.projectName}}</div>
                </van-col>
                <van-col span="5">{{itemB.projectStartDateTime}}</van-col>
                <van-col span="4">{{itemB.projectOutput}}</van-col>
                <van-col span="4">{{itemB.projectActuallyOutput}}</van-col>
              </van-row>
              <van-row type="flex" justify="center" align="center" class="pb">
                <van-col span="1"/>
                <van-col span="6">当前进度:</van-col>
                <van-col span="1"/>
                <van-col span="12">
                  <van-progress :percentage="itemB.scheduleRate" stroke-width="5"/>
                </van-col>
                <van-col span="4"/>
              </van-row>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>

      <van-popup v-model="esVisiable" style="width: 85%;">
        <select-note
          title="执行标准快捷输入"
          v-model="dataForm"
          :dataList="executelist"
          :selectType="1"
          @close="esVisiable = false"
        />
      </van-popup>
      <van-popup v-model="wnVisiable" style="width: 85%;">
        <select-note
          title="作业内容短语快捷输入"
          v-model="dataForm"
          :dataList="worknotelist"
          :selectType="2"
          @close="wnVisiable = false"
        />
      </van-popup>
      <van-popup v-model="wrVisiable" style="width: 85%;">
        <select-note
          title="作业要求短语快捷输入"
          v-model="dataForm"
          :dataList="workrequireList"
          :selectType="3"
          @close="wrVisiable = false"
        />
      </van-popup>

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
              >{{item.name}}
              </van-checkbox>
            </van-checkbox-group>
          </div>
          <div class="btn_bottom">
            <van-button plain @click="pstVisible = false">取消</van-button>
            <van-button type="info" @click="projectTypeChangeHandler()">确认</van-button>
          </div>
        </div>
      </van-popup>

      <projectgroup-add-or-update
        v-if="projectGroupVisible"
        ref="projectgroupAddOrUpdate"
        @refreshDataList="init"
      ></projectgroup-add-or-update>
    </div>

    <div class="foot">
      <van-button @click="goBack()" type="warning">返回</van-button>
      <van-button @click="dataFormSubmit" type="info">提交</van-button>
    </div>
  </div>
</template>

<script>
  import projectgroupAddOrUpdate from './projectgroup-add-or-update'
  import moment from 'moment'
  import projectInfo from '@/components/projectinfo-module'
  import selectNote from '@/components/select-module/selectnote'
  import quickInput from '@/components/quickinput-module/quickinput.vue'

  export default {
    data () {
      return {
        datePickerShow: false,
        esVisiable: false,
        wnVisiable: false,
        wrVisiable: false,
        pstVisible: false,
        selectedTypeName: '',
        selectedTypeNum: 0,
        projectNo: this.$route.query.projectNo,
        projectGroupVisible: false,
        ptValue: [],
        outputCalVisible: false,
        projectInfo: '',
        saList: [],
        dataForm: {
          executeStandard: '',
          workNote: '',
          workRequire: '',
          projectWriter: '',
          projectNo: '',
          projectCharge: '',
          projectChargeAccount: '',
          projectOutput: '',
          projectOutputNote: '',
          projectBegunDateTime: '',
          projectWorkDate: '',
          projectQualityDate: '',
          projectActuallyOutput: ''
        },
        groupRateList: [],
        produceList: [],
        executelist: [], //  执行标准列表
        worknotelist: [], //  作业内容列表
        workrequireList: [], //  作业要求列表
        groupWorkList: [], //  作业分组情况

        projectTypelist: [], //  项目类型列表
        workTypelist: [], //  工作类型列表
        totalOutPut: 0 //  预计总产值计算数值
      }
    },
    components: {
      projectgroupAddOrUpdate,
      quickInput,
      selectNote,
      projectInfo
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        //  this.$refs['dataForm'].resetFields()
        this.getPlanByProjectNo()
        this.getExecutelist()
        this.getWorkNotelist()
        this.getWorkRequireList()
        this.getProjectDataCoe()
        this.getInfoByProjectNo(this.projectNo)
        this.getGroupByProjectNo(this.projectNo)
        this.getWorkTypelist(this.projectNo).then(success => {
          this.checkOutputVoInit()
        })
        this.dataForm.projectBegunDateTime = moment(new Date()).format('YYYY-MM-DD')
        //  this.getProjectCharge(this.projectNo)  //  获取项目负责人
      },
      onDateConfirm (date) {
        this.dataForm.projectBegunDateTime = moment(date).format('YYYY-MM-DD')
      },

      grisEvent (val) {
        if (this.saList[val].sollapseactive.length === 1) {
          this.saList[val].sollapseactive = []
        } else {
          this.saList[val].sollapseactive = ['1']
        }
      },

      //  获取统计方法
      getSummaryMethod (param) {
        console.log(param)
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '预计产值合计：'
            return
          }
          if (index === 1 || index === 2 || index === 3 || index === 4) {
            sums[index] = '/'
            return
          }
          if (index === 5) {
            const values = data.map(item => Number(item[column.property]))
            let sum = 0
            for (let value of values) {
              sum += value
            }
            sums[index] = sum
            return
          }
        })
        return sums
      },
      //  工作日期
      countWorkDateHandler () {
        let workNum =
          this.dataForm.projectOutput / 2400 -
          parseInt(this.dataForm.projectOutput / 2400)
        console.log(workNum)
        if (workNum === 0) {
          this.dataForm.projectWorkDate = Math.round(
            this.dataForm.projectOutput / 2400
          )
        } else if (workNum < 0.5) {
          this.dataForm.projectWorkDate =
            parseInt(this.dataForm.projectOutput / 2400) + 0.5
        } else {
          this.dataForm.projectWorkDate = Math.round(
            this.dataForm.projectOutput / 2400
          )
        }
        let qualityNum =
          this.dataForm.projectWorkDate * 0.25 -
          parseInt(this.dataForm.projectWorkDate * 0.25)
        if (qualityNum === 0) {
          this.dataForm.projectQualityDate = Math.round(
            this.dataForm.projectWorkDate * 0.25
          )
        } else if (qualityNum < 0.5) {
          this.dataForm.projectQualityDate =
            parseInt(this.dataForm.projectWorkDate * 0.25) + 0.5
        } else {
          this.dataForm.projectQualityDate = Math.round(
            this.dataForm.projectWorkDate * 0.25
          )
        }
      },
      //  选择作业组
      projectGroupHandle (projectNo) {
        this.$refs.dataForm.validateAll().then(success => {
          this.dataFormSubmit(false)
          this.projectGroupVisible = true
          this.$nextTick(() => {
            console.log(this.dataForm.projectOutput)
            this.$refs.projectgroupAddOrUpdate.init(
              projectNo,
              this.dataForm.projectOutput
            )
          })
        })
      },
      //  表单提交
      dataFormSubmit (goback = true) {
        this.$refs.dataForm.validateAll().then(success => {
          this.$http({
            url: this.$http.adornUrl(`/project/plan/save`),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              projectNo: this.projectNo,
              projectWorkload: this.dataForm.projectWorkload,
              projectWorkDate: this.dataForm.projectWorkDate,
              projectQualityDate: this.dataForm.projectQualityDate,
              projectOutput: this.dataForm.projectOutput,
              executeStandard: this.dataForm.executeStandard,
              workRequire: this.dataForm.workRequire,
              workNote: this.dataForm.workNote,
              projectWriter: this.projectInfo.createUserName,
              projectBegunDateTime: this.dataForm.projectBegunDateTime
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$notify({
                message: '保存并提交成功',
                type: 'success',
                duration: 1500
              })
              if (goback) this.goBack()
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
      //  项目分组信息
      getGroupByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(
              `/project/group/getListByProjectNo/${projectNo}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.groupWorkList = data.list
              resolve(data.list)
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  获取项目计划
      getPlanByProjectNo () {
        return new Promise((resolve, reject) => {
          if (this.projectNo) {
            this.$http({
              url: this.$http.adornUrl(`/project/plan/info/${this.projectNo}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.projectPlan != null) {
                  this.dataForm.id = data.projectPlan.id
                  this.dataForm.projectNo = data.projectPlan.projectNo
                  this.dataForm.projectWorkDate =
                    data.projectPlan.projectWorkDate
                  this.dataForm.projectQualityDate =
                    data.projectPlan.projectQualityDate
                  this.dataForm.projectOutput = data.projectPlan.projectOutput
                  this.dataForm.executeStandard =
                    data.projectPlan.executeStandard
                  this.dataForm.workRequire = data.projectPlan.workRequire
                  this.dataForm.workNote = data.projectPlan.workNote
                  this.dataForm.projectBegunDateTime =
                    data.projectPlan.projectBegunDateTime
                  this.dataForm.projectCharge = data.projectPlan.projectCharge
                }
                resolve(data)
              } else {
                this.$notify({
                  message: data.msg,
                  type: 'danger',
                  duration: 1500
                })
                reject(data.msg)
              }
            })
          } else {
          }
        })
      },
      //  获取项目基本信息
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
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  获取生产负责人列表
      getProduceList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/getProduceList`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.produceList = data.list
              resolve(data.list)
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  获取执行标准列表
      getExecutelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/1`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.executelist = data.list
              resolve(data.list)
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  获取作业内容列表
      getWorkNotelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/3`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.worknotelist = data.list
              resolve(data.list)
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  获取作业要求列表
      getWorkRequireList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/4`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workrequireList = data.list
              resolve(data.list)
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  获取项目负责人
      getProjectCharge (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/plan/info/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.projectPlan)
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  获取各组项目产值和进度数据
      getProjectDataCoe () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/group/getProjectDataCoe`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.groupRateList = data.list
              this.groupRateList.forEach(item => {
                this.saList.push({sollapseactive: []})
              })
              resolve(data.list)
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  获取项目类型列表
      getProjectTypelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/projecttype/getProjectTypelist`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectTypelist = []
              this.projectTypelist.push({id: 0, name: '全部'})
              console.log(this.projectTypelist)
              for (let item of data.list) {
                this.projectTypelist.push({id: item.id, name: item.name})
              }
              resolve(data.projectTypelist)
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  获取工作类型列表
      getWorkTypelist (projectNo) {
        console.log(projectNo)
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/checkoutputtemp/list`),
            method: 'get',
            params: this.$http.adornParams({
              projectNo: projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workTypelist = data.list
              resolve(data.workTypelist)
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  工作类型可见或不可见
      workTypeInit () {
        for (let workType of this.workTypelist) {
          workType.isVisible = false
          //  工作类型 不属于 任意项目则设为 可见
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
      //  项目类型改变
      projectTypeChangeHandler () {
        console.log(this.ptValue)
        // 取出第一个名称回显
        if (this.ptValue.length !== 0) {
          this.selectedTypeName = this.projectTypelist[this.ptValue[0]].name
        }
        //  回显项目类型数量
        this.selectedTypeNum = this.ptValue.length - 1
        for (let ptvalue of this.ptValue) {
          //  全选情况下
          if (ptvalue === 0) {
            this.ptValue = []
            this.selectedTypeName = this.projectTypelist[1].name
            this.selectedTypeNum = this.projectTypelist.length - 2
            for (let pw of this.projectTypelist)
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
      //  产值明细计算
      setProjectOutputHandle () {
        this.ptValue = []
        this.totalOutPut = 0
        this.getProjectTypelist().then(success => {
          this.getWorkTypelist(this.projectNo).then(success => {
            let ptType = this.projectInfo.projectType.split(',')
            if (ptType.length >= 0) {
              this.selectedTypeName = ptType[0]
              this.selectedTypeNum = ptType.length - 1
            }
            // this.selectedTypeName = ptType;
            console.log(ptType)
            for (let pt of this.projectTypelist) {
              for (let type of ptType) {
                if (pt.name === type) {
                  this.ptValue.push(pt.id)
                }
              }
            }
            this.workTypeInit()
            this.checkOutputVoInit()
          })
        })
        this.outputCalVisible = true
      },
      //  提交 预算产值明细
      putProjectOutputToApiHandle () {
        this.outputCalVisible = false
        this.$http({
          url: this.$http.adornUrl(`/project/checkoutputtemp/save`),
          method: 'post',
          data: this.$http.adornData({
            projectNo: this.projectNo,
            tempOutputlist: this.workTypelist
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.updateProjectRemark()
            this.dataForm.projectOutput = this.totalOutPut
            this.countWorkDateHandler()
          } else {
            this.$notify({
              message: data.msg,
              type: 'danger',
              duration: 1500
            })
          }
        })
      },
      //  通过项目ID 更新项目预算产值备注
      updateProjectRemark () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/update`),
            method: 'post',
            data: this.$http.adornData({
              id: this.projectInfo.id || undefined,
              outputRemark:
                this.projectInfo.outputRemark == null
                  ? ''
                  : this.projectInfo.outputRemark
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
            } else {
              this.$notify({
                message: data.msg,
                type: 'danger',
                duration: 1500
              })
              reject(data.msg)
            }
          })
        })
      },
      //  工作类型在表格勾选显示
      chooseRatio (params) {
        //   console.log(params)
        let temp = []
        params.forEach(e => {
          if (e.checked) {
            e.typeOutput = this.numFilter(
              e.workLoad * e.projectRatio * e.unitOutput
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
      //  根据工作类型可见不可见 来显示右侧工作组工作类型数据
      checkOutputVoInit () {
        let totalOutPut = 0
        let worktypeList = this.workTypelist
        worktypeList.forEach((ele, index) => {
          if (ele.checked) {
            ele.typeOutput = parseFloat(
              (ele.projectRatio * ele.unitOutput * ele.workLoad).toFixed(2)
            )
            totalOutPut = parseFloat((totalOutPut + ele.typeOutput).toFixed(2))
          }
        })
        this.workTypelist = worktypeList
        this.totalOutPut = totalOutPut
      },
      //  保留小数点后两位的过滤器，尾数不四舍五入
      numFilter (value) {
        //  截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3)
        let realVal = tempVal.substring(0, tempVal.length - 1)
        return realVal
      },
      //  返回
      goBack () {
        this.$router.push('project-project')
      }
    },
    watch: {
      $route: function (to, from) {
        this.projectNo = to.query['projectNo']
        //  执行数据更新查询
        if (to.name === 'project-editallocation') {
          this.init()
        } else {
         // closeTab("project-editallocation")
        }
      }
    }
  }
</script>

<style scoped>
  .folder_style {
    padding: 5px;
    display: flex;
    justify-content: left;
  }

  .folder_style button {
    min-width: 84px;
  }

  .folder_style .folder_span {
    font-size: 9pt;
    color: #3b97d7;
  }

  .vf .vfs .van-cell {
    width: 80%;
    margin: 0 auto;
    border: 1px dashed #d9d2d2;
    padding: 0px;
    border-radius: 5px;
  }

  .ccl {
    padding-top: 10px;
    padding-left: 20px;
  }

  .ccl .van-cell {
    padding: 0px;
  }

  .ccl .van-field__label {
    width: 70px;
  }

  .pobtn .van-button {
    height: 35px;
  }

  .tc {
    text-align: center;
  }

  .groupitem {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .wgds {
    margin-top: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgb(195, 197, 199);
    padding-left: 10px;
  }

  .mlmrmtwhbb {
    margin-left: 1%;
    margin-right: 1%;
    margin-top: 5px;
    overflow: scroll;
    width: 98%;
    height: 150px;
    border-bottom: 1px solid rgb(195, 197, 199);
  }

  .talfspl {
    text-align: left;
    font-size: 16px;
    padding-left: 10px;
  }

  .tarfspr {
    text-align: right;
    font-size: 15px;
    padding-right: 10px;
  }

  .mtmb10 {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .wptpbfpl {
    width: 80%;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 15px;
    padding-left: 1%;
  }

  .pt10mt5mb8bt1 {
    padding-top: 10px;
    margin-top: 5px;
    margin-bottom: 8px;
    border-top: 1px solid rgb(195, 197, 199)
  }

  .whmlmr {
    width: 98%;
    height: 150px;
    overflow: scroll;
    margin-left: 1%;
    margin-right: 1%;
  }

  .pbpt {
    padding-bottom: 5px;
    padding-top: 5px;
  }

  .zywwt {
    width: 90%;
    margin-left: 1%;
    margin-top: 10px;
    margin-right: 1%;
    padding-top: 10px;
  }

  .mmb {
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
    border: 1px solid #fff;
  }

  .bbs {
    border-bottom: 1px solid #e8e5e5;
  }

  .plpr {
    padding-left: 4px;
    padding-right: 4px;
  }

  .ptpb {
    padding-top: 5px;
    padding-bottom: 1px;
  }

  .pb {
    padding-bottom: 5px;
  }

  .wmrml {
    width: 98%;
    margin-right: 1%;
    margin-left: 1%;
  }

  .frmr30 {
    float: right;
    margin-right: 30px;
  }

  .pts {
    width: 100%;
    font-size: 16px;
    margin-bottom: 4px;
    margin-top: 4px;
    border-bottom: 1px dotted rgb(195, 197, 199);
    padding-bottom: 4px;
    padding-left: 10px;
  }

  .ptsd {
    width: 100%;
    overflow: scroll;
    height: 150px;
    padding-left: 10px;
    border-bottom: 1px dotted rgb(195, 197, 199)
  }

  .ptsdv {
    margin-top: 2px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgb(195, 197, 199)
  }

  .mbmt5 {
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .fsml {
    color: #1989fa;
    font-size: 15px;
    margin-left: 10px;
  }

  .nis {
    margin-left: 10%;
    width: 80%;
  }

  .nis .van-field__control {
    border: 1px solid #cfcfcc;
  }

  .nis .van-cell {
    padding: 0px;
  }

  .whdfaic {
    width: 100%;
    height: 25px;
    display: flex;
    align-items: center;
  }

  .wdfjacb {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .bb1ptpb5 {
    border-bottom: 1px solid rgb(195, 197, 199);
    padding-top:5px;
    padding-bottom: 5px;
  }

  .os {
    overflow: scroll;
  }

  .pglsfirst .van-col {
    padding-bottom: 5px;
    font-size: 14px;
  }

  .pglssecond .van-field__control {
    border: 1px solid #cfcfcc;
  }

  .w25fl {
    width: 25%;
    float: left;
  }

  .psts .van-cell {
    padding: 5px 17px 3px 9px;
  }

  .psts {
    margin-top: 5px;
    margin-bottom: 5px;
    border-top: 1px dashed #d9d2d2;
    border-bottom: 1px dashed #d9d2d2;
  }

  .psts .van-cell__value {
    font-size: 15px;
  }

  .tac {
    text-align: center;
  }

  .foot {
    margin-top: 20px;
    display: flex;
    width: 100%;
    justify-content: space-around;
  }

  .tas{
    width: 80%;
    height:100px;
    margin-left:10%;
    margin-right:10%;
    border: 1px dashed #d9d2d2;
    padding: 0px;
    border-radius: 5px;overflow:scroll; letter-spacing:1.4px;
  }
</style>
