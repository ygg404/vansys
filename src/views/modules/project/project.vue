<template>
  <div style="width: 98%;">
    <van-tabs v-model="roleradio" class="roletab">
      <van-tab title="安排" :disabled="!isAuth('project:project:plan')"/>
      <van-tab title="作业" :disabled="!isAuth('project:work:list')"/>
      <van-tab title="质检" :disabled="!isAuth('project:quality:list')"/>
      <van-tab title="质审" :disabled="!isAuth('project:quality:auth')"/>
      <van-tab title="核算" :disabled="!isAuth('project:checkoutput:list')"/>
      <van-tab title="审定" :disabled="!isAuth('project:authorize:list')"/>
    </van-tabs>
    <date-module v-model="dataForm" @change="getDataList"></date-module>
    <!---->
    <van-row type="flex" justify="space-between" align="bottom" class="mb5p40">
      <van-col span="1"/>
      <van-col span="15">
        <van-search
          class="searchCon"
          v-model="dataForm.key"
          @input="pageIndex=1,getDataList()"
          @cancel="pageIndex=1,dataForm.key = '' "
          show-action
          placeholder="搜索关键词..."
        />
      </van-col>
      <van-col span="8" class="addcontract">
        <div class="lrmr2">
<!--          <van-button type="primary" @click="exportProjectExcel">导出Excel</van-button>-->
        </div>
      </van-col>
    </van-row>

    <van-row type="flex" justify="space-around">
      <van-button type="info" @click="outputChartHandle" size="small" icon="bar-chart-o">产值表</van-button>
      <van-button type="info" @click="collectChartHandle" size="small" icon="bar-chart-o">产值汇总表</van-button>
      <van-button type="info" @click="qualityChartHandle" size="small" icon="bar-chart-o">质量表</van-button>
    </van-row>

    <van-row class="pm5b">
      <van-col span="6" class="tac">项目编号</van-col>
      <van-col span="12" class="tac">项目名称</van-col>
      <van-col span="6" class="tac">操作</van-col>
    </van-row>

    <div class="table_excuse" v-if="dataList.length < 1">暂无数据</div>
    <div ref="dataBox" :style="'max-height: ' + (documentClientHeight - 335).toString() + 'px'" class="os">
      <van-row
        :key="index"
        v-for="(item,index) in dataList"
        type="flex"
        align="center"
        justify="center"
        style="margin-bottom:18px;"
      >
        <van-col span="7" style="padding:4px;">
          <div class="mb5tac">{{item.projectNo}}</div>
          <div class="dljcsb">
            <div style="margin-left:10%;">
              <div v-if="item.projectStatus === 0">
                <van-tag type="success">启动</van-tag>
              </div>
              <div v-if="item.projectStatus === 1">
                <van-tag type="danger">暂停</van-tag>
              </div>
            </div>
            <div v-if="roleradio == 0" class="mr5">
              <div v-if="item.isPlan === 1">
                <van-tag type="success">已安排</van-tag>
              </div>
              <div v-if="item.isPlan !== 1">
                <van-tag type="danger">未安排</van-tag>
              </div>
            </div>
            <div v-if="roleradio == 1" class="mr5">
              <div v-if="item.isWork === 1">
                <van-tag type="success">已作业</van-tag>
              </div>
              <div v-else-if="item.isWork === 2">
                <van-tag type="danger">返修中</van-tag>
              </div>
              <div v-else>
                <van-tag>未作业</van-tag>
              </div>
            </div>
            <div v-if="roleradio == 2" class="mr5">
              <div v-if="item.isCheck == 1">
                <van-tag type="success">已质检</van-tag>
              </div>
              <div v-else-if="item.isCheck === 2">
                <van-tag type="danger">返修中</van-tag>
              </div>
              <div v-else-if="item.isCheck === 3">
                <van-tag type="primary">返修完成</van-tag>
              </div>
              <div v-else>
                <van-tag>未质检</van-tag>
              </div>
            </div>
            <div v-if="roleradio == 3" class="mr5">
              <div v-if="item.isQauth == 1">
                <van-tag type="success">已质审</van-tag>
              </div>
              <div v-else>
                <van-tag>未质审</van-tag>
              </div>
            </div>
            <div v-if="roleradio == 4" class="mr5">
              <div v-if="item.isOutput  === 1">
                <van-tag type="success">已核算</van-tag>
              </div>
              <div v-if="item.isOutput !== 1">
                <van-tag type="danger">未核算</van-tag>
              </div>
            </div>
            <div v-if="roleradio == 5" class="mr5">
              <div v-if="item.isAuthorize === 1">
                <van-tag type="success">已审核</van-tag>
              </div>
              <div v-else>
                <van-tag>未审核</van-tag>
              </div>
            </div>
          </div>
        </van-col>
        <van-col span="10" style="padding:5px;">
          <div class="prons">{{item.projectName}}</div>
        </van-col>
        <van-col span="7">
          <van-row type="flex" align="center" justify="center">
            <van-col>
              <van-button round type="info" size="small" @click="showDetailsDialogEvent(item)">详情</van-button>
            </van-col>
          </van-row>
        </van-col>
      </van-row>
    </div>
    <!--分页控件-->
    <div style="margin-top:5px;padding-top:5px;border-top:1px solid rgb(213, 226, 239);">
      <van-pagination v-model="pageIndex" :page-count="totalPage" mode="simple" @change="getDataList()"/>
    </div>

    <van-dialog ref="pd" v-model="planProjectPopupShow" :showConfirmButton="confirmShow" showCancelButton cancelButtonColor="red">
      <div slot="title" style="font-size:18px;font-weight:700;">项目详情</div>
      <div style="width:100%;">
        <div style="width:99%;margin:0 auto;">
          <van-row class="mt8" v-if="dpiData.projectStatus === 1">
            <van-col span="8" class="dt" style="color:#1989fa;">暂停缘由:</van-col>
            <van-col span="16" class="dc" style="color:red;">{{dpiData.suspendExcuse}}</van-col>
          </van-row>
          <van-row class="mt8" v-if="dpiData.projectStatus === 1">
            <van-col span="8" class="dt" style="color:#1989fa;">暂停时间:</van-col>
            <van-col span="16" class="dc" style="color:red;">{{dpiData.suspendTime}}</van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">项目编号:</van-col>
            <van-col span="16" class="dc">{{dpiData.projectNo}}</van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">项目名称:</van-col>
            <van-col span="16" class="dc">{{dpiData.projectName}}</van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">项目启动时间:</van-col>
            <van-col
              span="16"
              class="dc"
            >{{dpiData.projectStartDateTime == null?'-':dpiData.projectStartDateTime}}
            </van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">项目负责人:</van-col>
            <van-col span="16" class="dc">{{dpiData.projectCharge}}</van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">项目开工时间:</van-col>
            <van-col
              span="16"
              class="dc"
            >{{dpiData.projectBegunDateTime == null?'-':dpiData.projectBegunDateTime}}
            </van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">作业完成时间:</van-col>
            <van-col
              span="16"
              class="dc"
            >{{dpiData.wFinishDateTime == null?'-':dpiData.wFinishDateTime}}
            </van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">质检完成时间:</van-col>
            <van-col
              span="16"
              class="dc"
            >{{dpiData.qFinishDateTime == null?'-':dpiData.qFinishDateTime}}
            </van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">结算时间:</van-col>
            <van-col
              span="16"
              class="dc"
            >{{dpiData.cutOffTime == null?'-':dpiData.cutOffTime.substring(0,7)}}
            </van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">作业工期:</van-col>
            <van-col
              span="16"
              class="dc"
            >{{dpiData.projectWorkDate == null?'-':dpiData.projectWorkDate}}
            </van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">质检工期:</van-col>
            <van-col
              span="16"
              class="dc"
            >{{dpiData.projectQualityDate == null?'-':dpiData.projectQualityDate}}
            </van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">质检工期:</van-col>
            <van-col
              span="16"
              class="dc"
            >{{dpiData.projectQualityDate == null?'-':dpiData.projectQualityDate}}
            </van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">返修天数:</van-col>
            <van-col span="16" class="dc">{{dpiData.backDateNum == null?'-':dpiData.backDateNum}}</van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">暂停天数:</van-col>
            <van-col span="16" class="dc">{{dpiData.suspendDay == null?'0':dpiData.suspendDay}}</van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">作业超时天数:</van-col>
            <van-col
              span="16"
              class="dc"
            >{{dpiData.woverTime == null || dpiData.projectStatus == 1?'-':dpiData.woverTime}}
            </van-col>
          </van-row>
          <van-row class="mt8">
            <van-col span="8" class="dt">质检超时天数:</van-col>
            <van-col span="16" class="dc">{{dpiData.qoverTime == null?'-':dpiData.qoverTime}}</van-col>
          </van-row>
          <van-row
            style="margin-top:8px;margin-bottom:10px;"
            v-if="roleradio==1 && dpiData.isCharge == 1"
            @click="setScheduleHandle(dpiData)"
          >
            <van-col span="8" class="dt">项目进度:</van-col>
            <van-col span="16" class="dc">
              <van-progress
                :percentage="dpiData.scheduleRate != null? dpiData.scheduleRate : 0"
                stroke-width="8"
              />
            </van-col>
          </van-row>
          <van-row
            style="margin-top:8px;margin-bottom:10px;"
            v-else
            @click="getScheduleHandle(dpiData)"
          >
            <van-col span="8" class="dt">项目进度:</van-col>
            <van-col span="16" class="dc">
              <van-progress
                :percentage="dpiData.scheduleRate != null? dpiData.scheduleRate : 0"
                stroke-width="8"
              />
            </van-col>
          </van-row>

          <van-row v-if="(isAuth('project:work:update')) && roleradio == 1" type="flex" justify="space-around" class="workfooterbtnstyle">
            <van-col span="10" style="text-align:center;">
                 <van-button type="small" style="background-color: white"
                             :style="{color:dpiData.projectStatus === 0?'red':'#1989fa',border:dpiData.projectStatus === 0?'1px solid red':'1px solid #1989fa'}"
                             @click="stopProjectHandle(dpiData)">
                   {{dpiData.projectStatus === 0? '暂停项目' : '启动项目'}}
                 </van-button>

            </van-col>
            <van-col span="10" style="text-align:center;">
              <van-button type="small" style="background-color: white;color:orangered;border:1px solid orangered"
                          v-if="dpiData.submitNote == null && dpiData.backId != null & dpiData.isCharge === 1"
                          @click="setBackworkHandle(dpiData,true)">查看返修
              </van-button>
            </van-col>
          </van-row>


          <div>
            <button class="confirmbtn" style="float:right;" v-if="roleradio === 0 && isAuth('project:project:plan')"
                    @click="editProjectHandle(dpiData)">编辑安排
            </button>
            <button class="confirmbtn" style="float:right;"
                    v-if="roleradio === 1 && isAuth('project:work:update') && dpiData.isCharge === 1"
                    @click="editWorkHandle(dpiData)">编辑作业
            </button>
            <button class="confirmbtn" style="float:right;" v-if="roleradio === 2 && isAuth('project:quality:update')"
                    @click="editQualityHandle(dpiData)">编辑质检
            </button>
            <button class="confirmbtn" style="float:right;"
                    v-if="roleradio === 3 && isAuth('project:quality:auth') && dpiData.isCheck === 1"
                    @click="editQualityAuthHandle(dpiData)">编辑质审
            </button>
            <button class="confirmbtn" style="float:right;"
                    v-if="roleradio === 4 && isAuth('project:checkoutput:update')" @click="editOutputHandle(dpiData)">
              编辑核算
            </button>
            <button class="confirmbtn" style="float:right;" v-if="roleradio === 5 && isAuth('project:project:plan')"
                    @click="editExamineHandle(dpiData)">编辑审定
            </button>
          </div>

        </div>
      </div>
    </van-dialog>

    <van-dialog
      :title="'暂停缘由 (项目编号:' + selectedItem.projectNo + ')'"
      v-model="suspendVisible"
      show-cancel-button
      @cancel="suspendVisible = false"
      @confirm="updateStatusHandle(selectedItem)"
    >
      <van-cell-group>
        <van-field v-model="suspendExcuse" placeholder="请填写暂停的缘由"/>
      </van-cell-group>
    </van-dialog>

    <van-dialog :title="scheduleTip" v-model="scheduleDialogVisible" confirmButtonText="返回">
      <van-row style="margin-top:10px;margin-bottom:10px;">
        <van-col span="8">
          <div style="text-align:center;">日期</div>
        </van-col>
        <van-col span="8">
          <div style="text-align:center;">进度比率</div>
        </van-col>
        <van-col span="8">
          <div style="text-align:center;">进度内容</div>
        </van-col>
      </van-row>
      <van-row v-if="scheduleList.length == 0" type="flex" justify="space-around">
        <van-col span="20">
          <div style="text-align:center;font-size:17px;color:#7c7575;">暂无数据</div>
        </van-col>
      </van-row>
      <van-row
        :key="index"
        v-else
        v-for="(item,index) in scheduleList"
        type="flex"
        align="center"
        justify="center"
        style="margin-bottom:18px;"
      >
        <van-col span="8">
          <div style="text-align:center;">{{item.createTime}}</div>
        </van-col>
        <van-col span="8">
          <div style="text-align:center;">{{item.scheduleRate}}</div>
        </van-col>
        <van-col span="8">
          <div style="text-align:center;">{{item.scheduleNote}}</div>
        </van-col>
      </van-row>
    </van-dialog>
    <!---->

    <!-- 弹窗, 新增 / 修改  项目组-->
    <projectschedule-add-or-update
      v-if="projectscheduleVisible"
      ref="projectscheduleAddOrUpdate"
      @refreshDataList="getDataList"
    ></projectschedule-add-or-update>
    <!-- 弹窗, 新增 / 修改  返修-->
    <backwork-add-or-update
      v-if="backworkVisible"
      ref="backworkAddOrUpdate"
      @refreshDataList="getDataList"
    ></backwork-add-or-update>
  </div>
</template>

<script>
  import moment from 'moment'
  import dateModule from '@/components/date-module'
  import {isAuth} from '../../../utils'
  import projectscheduleAddOrUpdate from './projectschedule-add-or-update'
  import backworkAddOrUpdate from './backwork-add-or-update'

  export default {
    data () {
      return {
        roleradio: 1,
        confirmShow: false,
        loading: false,
        finished: false,
        // 折叠面板模拟数据
        activeNames: [],
        suspendVisible: false, // 暂停项目窗口
        planProjectPopupShow: false,
        backworkVisible: false,
        projectscheduleVisible: false,
        dpiData: '',
        // 新增 / 修改 合同 (标志)
        addOrUpdateVisible: false,
        // 新增 / 修改 项目 (标志)
        projectAddOrUpdateVisible: false,
        suspendExcuse: '', // 暂停缘由
        selectedItem: '', // 暂停选中的项目
        // 总页数
        allPage: 1,
        // 数据
        dataList: [],
        dataForm: {
          dateItemId: 0,
          key: '',
          sidx: 'id',
          order: 'desc',
          startDate: '',
          endDate: ''
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        scheduleDialogVisible: false,
        scheduleTip: '',
        scheduleList: []
      }
    },

    // 组件注册
    components: {
      projectscheduleAddOrUpdate,
      backworkAddOrUpdate,
      dateModule
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    created () {
      this.pageSize = 10
      this.pageIndex = 1
      this.dataForm.startDate = moment(
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      ).format('YYYY-MM-DD')
      this.dataForm.endDate = moment(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      ).format('YYYY-MM-DD')
      this.getDataList()
    },
    mounted () {
      this.planProjectPopupShow = false
      this.dateItemList = [
        {id: 0, dateItem: '项目启动时间'},
        {id: 1, dateItem: '项目开工时间'},
        {id: 2, dateItem: '作业完成时间'},
        {id: 3, dateItem: '质检完成时间'},
        {id: 4, dateItem: '结算时间'}
      ]
      this.pageIndex = 1
      this.pageSize = 10
      // 角色选择初始化
      if (isAuth('project:authorize:list')) this.roleradio = 5
      if (isAuth('project:checkoutput:list')) this.roleradio = 4
      if (isAuth('project:quality:auth')) this.roleradio = 3
      if (isAuth('project:quality:list')) this.roleradio = 2
      if (isAuth('project:work:list')) this.roleradio = 1
      if (isAuth('project:project:plan')) this.roleradio = 0
      if (
        this.$cookie.get('jxrole') !== null &&
        this.$cookie.get('jxrole') !== ''
      ) {
        this.roleradio = parseInt(this.$cookie.get('jxrole'))
      }
    },

    methods: {
      // 排序字段改变
      changeSort (val) {
        switch (val.order) {
          case 'ascending':
            this.dataForm.order = 'asc'
            break
          case 'descending':
            this.dataForm.order = 'desc'
            break
          default:
            this.dataForm.order = 'desc'
        }
        if (val.prop === 'projectNo') {
          this.dataForm.sidx = 'id'
        } else {
          this.dataForm.sidx = val.prop
        }
        this.getDataList()
      },

      // 获取数据列表
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/project/manage/page'),
          method: 'get',
          params: this.$http.adornParams({
            page: this.pageIndex,
            limit: this.pageSize,
            key: this.dataForm.key,
            sidx: this.dataForm.sidx,
            order: this.dataForm.order,
            startDate: this.dataForm.startDate,
            endDate: this.dataForm.endDate,
            dateItemId: this.dataForm.dateItemId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalPage
            // 计算 质检 和 作业超时时间
            for (let data of this.dataList) {
              if (this.planProjectPopupShow && this.dpiData.projectNo === data.projectNo) {
                this.dpiData = data
              }
              data.backDateNum = data.backDateNum === null ? 0 : data.backDateNum
              // 开工时间为空
              if (data.projectBegunDateTime == null) {
                data.woverTime = null
                data.qoverTime = null
              } else if (data.isPlan === 1) {
                // 项目已经安排
                // 作业时间为空 工作时间 为当前时间
                if (data.wFinishDateTime === null) {
                  let woverTime = parseInt(
                    (new Date() - new Date(data.projectBegunDateTime)) /
                    (24 * 60 * 60 * 1000) -
                    data.projectWorkDate +
                    data.backDateNum
                  )
                  data.woverTime = woverTime < 0 ? 0 : woverTime
                  data.qoverTime = null
                } else {
                  let woverTime = parseInt(
                    (new Date(data.wFinishDateTime) -
                      new Date(data.projectBegunDateTime)) /
                    (24 * 60 * 60 * 1000) -
                    data.projectWorkDate +
                    data.backDateNum
                  )
                  data.woverTime = woverTime < 0 ? 0 : woverTime
                  // 质检时间为空 质检时间 为当前时间
                  if (data.qFinishDateTime === null) {
                    let qoverTime = parseInt(
                      (new Date() - new Date(data.wFinishDateTime)) /
                      (24 * 60 * 60 * 1000) -
                      data.projectQualityDate
                    )
                    data.qoverTime = qoverTime < 0 ? 0 : qoverTime
                  } else {
                    let qoverTime = parseInt(
                      (new Date(data.qFinishDateTime) -
                        new Date(data.wFinishDateTime)) /
                      (24 * 60 * 60 * 1000) -
                      data.projectQualityDate
                    )
                    data.qoverTime = qoverTime < 0 ? 0 : qoverTime
                  }
                }
              }
            }
            this.$refs.dataBox.scrollTop = 0
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$notify.error(data.msg)
          }
        })
      },

      // 返修内容（isEdit 为true 可编辑返修）
      setBackworkHandle (item, isEdit = true) {
        this.backworkVisible = true
        this.$nextTick(() => {
          this.$refs.backworkAddOrUpdate.init(item.projectNo, isEdit)
        })
      },
      // 取消搜索
      CancelSearch () {
        this.dataForm.key = ''
        this.getDataList()
      },

      // 详情按钮点击事件
      showDetailsDialogEvent (item) {
        this.planProjectPopupShow = true
        this.dpiData = item
      },

      // 获取进度列表
      getScheduleHandle (item) {
        let projectNo = item.projectNo
        this.scheduleDialogVisible = true
        this.scheduleTip = '项目进度表（编号：' + projectNo + ')'
        this.$http({
          url: this.$http.adornUrl('/project/schedule/list'),
          method: 'get',
          params: this.$http.adornParams({
            projectNo: projectNo
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.scheduleList = data.list
          } else {
            this.scheduleList = []
          }
        })
      },

      // 获取返修内容列表
      getBackworkHandle (item) {
        let projectNo = item.projectNo
        this.backDialogVisible = true
        this.backTip = '返修内容表（项目编号：' + projectNo + ')'
        this.$http({
          url: this.$http.adornUrl(`/project/backwork/list/${projectNo}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.backWorkList = data.list
          } else {
            this.backWorkList = []
          }
        })
      },
      // 提交进度
      setScheduleHandle (item) {
        if (item.isWork === 1) {
          this.$notify({
            message: '当前项目已作业完成，无法添加进度！',
            type: 'danger',
            duration: 1500
          })
          return
        }

        // 项目质检已提交，就无法提交进度
        if (item.isCheck === 1) {
          this.$notify({
            message: '当前项目已质检完成，无法添加进度！',
            type: 'danger',
            duration: 1500
          })
          return
        }
        this.projectscheduleVisible = true
        this.$nextTick(() => {
          this.$refs.projectscheduleAddOrUpdate.init(item)
        })
      },

      // 编辑安排
      editProjectHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        this.$router.push({
          path: '/project-editallocation',
          query: {projectNo: item.projectNo}
        })
        this.planProjectPopupShow = false
      },
      // 编辑工作
      editWorkHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        if (item.scheduleRate < 90) {
          this.$notify(
            '项目未完结，最高进度只可达90%，请添加进度后再进行作业编辑'
          )
          return
        }
        this.$router.push({
          path: '/project-editwork',
          query: {projectNo: item.projectNo}
        })
        this.planProjectPopupShow = false
      },

      // 编辑质量审核
      editQualityAuthHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        this.$router.push({
          path: '/project-editqualityauth',
          query: {projectNo: item.projectNo}
        })
      },

      // 编辑质量检查
      editQualityHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        if (item.isWork !== 1) {
          this.$dialog
            .alert({
              title: '提示',
              message: '当前项目作业未完成, 是否继续质检?',
              showCancelButton: true
            })
            .then(() => {
              this.$router.push({
                path: '/project-editquality',
                query: {projectNo: item.projectNo}
              })
            })
            .catch(() => {
            })
        } else {
          this.$router.push({
            path: '/project-editquality',
            query: {projectNo: item.projectNo}
          })
        }
      },
      // 编辑产值核算
      editOutputHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        this.$router.push({
          path: '/project-editoutput',
          query: {projectNo: item.projectNo}
        })
      },

      // 编辑项目审定
      editExamineHandle (item) {
        this.$cookie.set('jxrole', this.roleradio)
        this.$router.push({
          path: '/project-editauthorize',
          query: {projectNo: item.projectNo}
        })
      },
      // 产值统计表
      outputChartHandle () {
        this.$router.push({path: '/project-chartoutput'})
      },
      // 产值汇总统计表
      collectChartHandle () {
        this.$router.push({path: '/project-chartcollect'})
      },
      // 质量统计表
      qualityChartHandle () {
        this.$router.push({path: '/project-chartquality'})
      },
      // 暂停或启动项目
      stopProjectHandle (item) {
        this.suspendExcuse = ''
        if (item.projectStatus === 0) {
          this.suspendVisible = true
          this.selectedItem = item
        } else {
          this.updateStatusHandle(item)
        }
      },
      // 暂停请求事件
      updateStatusHandle (item) {
        this.$http({
          url: this.$http.adornUrl(`/project/work/updateStatus`),
          method: 'post',
          data: this.$http.adornData({
            id: item.id,
            projectNo: item.projectNo,
            projectStatus: item.projectStatus === 0 ? 1 : 0,
            suspendExcuse: this.suspendExcuse
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.suspendVisible = false
            this.getDataList()
            this.$toast.success('操作成功')
            this.$nextTick(() => {
              this.planProjectPopupShow = false
            })
          } else {
            this.$toast.fail('操作失败:' + data.msg)
          }
        })
      },

      // 导出excel
      exportProjectExcel () {
        this.dataListLoading = true
        let sd = new Date(this.dataForm.startDate)
        let ed = new Date(this.dataForm.endDate)
        let startDate = moment(
          new Date(sd.getFullYear(), sd.getMonth(), 1)
        ).format('YYYY-MM-DD')
        let endDate = moment(
          new Date(ed.getFullYear(), ed.getMonth() + 1, 1)
        ).format('YYYY-MM-DD')
        this.$http({
          url: this.$http.adornUrl('/project/manage/exportExcel'),
          method: 'get',
          params: this.$http.adornParams({
            key: this.dataForm.key,
            sidx: this.dataForm.sidx,
            order: this.dataForm.order,
            startDate: startDate,
            endDate: endDate,
            dateItemId: this.dataForm.dateItemId
          }),
          responseType: 'blob'
        }).then(({data}) => {
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(data) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download =
            '项目管理列表（' + startDate + '-' + endDate + '）.xls' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          this.dataListLoading = false
        })
      }
    }
  }
</script>

<style lang="less">
  .roletab .van-tab {
    font-size: 16px;
    padding: 0px;
  }
  .van-tabs__line{
    background-color:@stylecolor;
  }
  .van-search {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 2px 4px;
    background-color: #fff;
    border: 1px solid #9b9a9a;
    border-radius: 14px;
  }

  .searchCon .van-cell {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    padding: 4px 1px;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
  }

  .addcontract .van-button {
    position: relative;
    display: inline-block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 38px;
    width: 80px;
    margin: 0;
    padding: 0;
    font-size: 13px;
    line-height: 35px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    -webkit-transition: opacity 0.2s;
    transition: opacity 0.2s;
    /* -webkit-appearance: none; */
    -webkit-text-size-adjust: 100%;
    border-radius: 8px;
  }

  .workfooterbtnstyle .van-button--normal {
    padding: 0 15px;
    font-size: 15px;
  }
  .workfooterbtnstyle{
    padding-botoom:10px;
    margin-top:5px;
  }

  .dc {
    text-align: left;
    padding-left: 10px;
    font-size: 15px;
  }

  .dt {
    text-align: right;
    font-size: 16px;
  }

  .mt8 {
    margin-top: 8px;
  }

  .chartbtn .van-button--normal {
    padding: 0 13px;
    border-radius: 9px;
  }

  .chartbtn .van-button {
    height: 35px;
  }

  .azt {
    height: 530px;
  }

  .mb5p40 {
    margin-bottom: 5px;
    padding: 4px 0px;
  }

  .lrmr2 {
    float: right;
    margin-right: 20px;
  }

  .mb5tac {
    margin-bottom: 5px;
    text-align: center;
  }

  .pm5b {
    padding-top: 10px;
    padding-bottom: 10px;
    margin-top: 10px;
    background: #faf7f7;
  }

  .tac {
    text-align: center;
  }

  .prons {
    height: 100%;
    width: 100%;
    white-space: normal;
    word-break: break-all;
    overflow: hidden;
  }

  .mr5 {
    margin-right: 5px;
  }

  .dljcsb {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .workfooterbtnstyle .van-button {
    height: 100%;
  }

  .confirmbtn {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    overflow: visible;
    text-transform: none;
    font: inherit;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: 16px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    transition: opacity .2s;
    -webkit-appearance: none;
    color:@stylecolor;
    background-color: #fff;
    width: 50%;
    height: 50px;
    line-height: 48px;
    border: 0;
    border-top:1px solid #f7f8f9;
  }
  .os {
    overflow: scroll;
  }
  .table_excuse{
    width: 100%;
    text-align: center;
    padding: 5px;
    color: #6f7180;
    line-height: 300%;
    border: 1px solid #1989faaf;
  }
</style>
