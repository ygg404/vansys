<template>
  <div>
    <van-dialog :title="!dataForm.id ? '新增项目' : '修改项目'" use-slot show-cancel-button v-model="visible"
                @cancel="cancelEvent" @confirm="dataFormSubmit" :beforeClose="beforeClose">

      <van-form  ref="dataForm">
        <van-field v-model="produceGroupName" name="produceGroupName" label="部门"
                   :rules="[{ required: true, message: '请选择部门' }]" readonly @click="groupPickerShow = true"/>
        <van-field v-model="projectProduceName" name="projectProduceName" label="生产负责人"
                   :rules="[{ required: true, message: '请选择生产负责人' }]" readonly @click="producePickerShow = true"/>
        <van-field v-model="dataForm.projectNo" name="projectNo" label="项目编号" placeholder="项目编号"
                   :rules="[{ required: true, message: '请填写项目编号' }]"  disabled/>
        <van-field v-model="dataForm.contractNo" name="contractNo" label="合同编号" placeholder="合同编号"
                   :rules="[{ required: true, message: '请填写合同编号' }]"  disabled/>
        <van-field v-model="dataForm.projectName" name="projectName" label="项目名称" placeholder="项目名称"
                   :rules="[{ required: false, message: '请填写项目名称' }]"/>
        <van-field v-model="dataForm.projectAuthorize" label="委托单位" disabled/>
        <van-field v-model="dataForm.projectNote"  label="委托要求" disabled/>
        <van-field v-model="dataForm.projectBusiness" label="业务负责人" disabled/>
        <van-field v-model="dataForm.projectType" label="项目类型" disabled/>


        <van-row type="flex" align="center" justify="center">
          <van-col span="12">
            <van-field v-model="dataForm.projectOutput" name="预计产值" label="预计产值"
            :rules="[{ required: false, message: '预计产值不能为空' }]"/>
          </van-col>
          <van-col span="12">
            <van-button icon="cashier-o" type="info" size="mini" @click="editOutputHandle()"/>
            <van-button  type="info" size="mini" @click="detailsOutputHandle()"> 明细情况 </van-button>
          </van-col>

        </van-row>

        <van-field v-model="dataForm.projectStartDateTime" label="项目启动时间" rule="projectStartDateTime" placeholder="项目启动时间" readonly @click="datePickerShow = true"
                   :rules="[{ required: true, message: '请填写项目启动时间' }]"/>
      </van-form>
    </van-dialog>
    <!-- 日历控件-->
    <van-calendar v-model="datePickerShow" :default-date="dataForm.projectStartDateTime == ''?new Date(): new Date(dataForm.projectStartDateTime)"
                  :min-date="new Date(2010,0,1)" :max-date="new Date(2050,11,31)"
                  @confirm="onDateConfirm" color="#1989fa" />
    <!-- 生产负责人 -->
    <van-popup ref="businessId" v-model="producePickerShow" position="bottom" >
      <van-picker show-toolbar title="选择业务负责人" value-key="username" :columns="produceList"
                  @cancel="producePickerShow = false" @confirm="onProduceConfirm"/>
    </van-popup>

    <van-popup v-model="groupPickerShow" position="bottom" >
      <van-picker show-toolbar title="选择部门" value-key="name" :columns="groupList"
                  @cancel="groupPickerShow = false" @confirm="onGroupConfirm"/>
    </van-popup>

    <output-add-or-update v-if="addOrUpdateVisible" ref="outputAddOrUpdate" @refreshDataList="refreshOutputHandle"/>
    <details-output  v-if="detailsOutputVisible" ref="detailsOutput"/>
  </div>
</template>

<script>
  import outputAddOrUpdate from './output-add-or-update'
  import detailsOutput from './details-output'
  import {stringIsNull} from '../../../utils'
  import moment from 'moment'
  export default {
    data () {
      return {
        produceGroupName:' ',
        projectProduceName:' ',
        datePickerShow: false,
        producePickerShow: false,
        groupPickerShow:false,
        addOrUpdateVisible: false,
        // 预计产值明细弹窗
        detailsOutputVisible:false,
        visible: false,
        dataForm: {
          id: 0,
          projectNo: '',
          contractNo: '',
          projectName: '',
          projectMoney: '',
          projectAuthorize: '',
          projectNote: '',
          projectBusiness: '',
          pStage: '',
          examineNote: '',
          projectType: '',
          projectStage: '',
          projectProduce: '',
          projectProduceAccount: '',
          projectProduceId: '',
          projectStartDateTime: '',
          projectOutput: '',
          outputRemark: '',  // 预算产值备注
          produceGroupId: ''
        },
        produceList: [],
        workTypelist: [],
        groupList: [], // 一级部门列表
      }
    },
    components: {
      outputAddOrUpdate,
      detailsOutput
    },
    methods: {
      detailsOutputHandle(){
        this.detailsOutputVisible = true
        this.$nextTick(() => {
          this.$refs.detailsOutput.init(this.workTypelist,this.dataForm)
        })
      },
      cancelEvent(){
        this.produceGroupName = ''
        this.visible = false
      },
      // 窗口关闭前的动作
      beforeClose (action, done) {
        console.log(this.visible)
        done(!this.visible)
      },
      // 启动时间选择
      onDateConfirm (date) {
        this.dataForm.projectStartDateTime = moment(date).format('YYYY-MM-DD')
        this.datePickerShow = false
      },
      // 生产负责人选择
      onProduceConfirm (item) {
        this.dataForm.projectProduceId = item.id
        this.projectProduceName = item.username
        this.dataForm.projectProduceAccount = item.useraccount
        this.producePickerShow = false
      },
      onGroupConfirm (item) {
        if(item.id !== this.dataForm.produceGroupId){
          this.dataForm.produceGroupId = item.id
          this.produceGroupName = item.name
          for (let group of this.groupList) {
            if (group.id === this.dataForm.produceGroupId) {
              this.produceList = []
              if (!stringIsNull(group.headId)) {
                this.produceList.push({
                  userId: group.headId,
                  username: group.headMan
                })
              }
              if (!stringIsNull(group.deputyId)) {
                this.produceList.push({
                  userId: group.deputyId,
                  username: group.deputyLeader
                })
              }
            }
          }
          let flag = 0
          for(let produce of this.produceList){
            if(produce.userId === this.dataForm.projectProduceId){
              flag++;
            }
          }
          if(flag === this.produceList.length - 1){
            this.dataForm.projectProduceId = ''
            this.projectProduceName = ''
          }
          console.log(this.produceList)
        }
        this.groupPickerShow = false
      },
      init (id, item) {
        this.getProduceList()
        this.getWorkgroupList().then(list => {
          this.groupList = list
        })
        this.dataForm.id = id || 0
        this.visible = true
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/project/project/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.projectNo = data.project.projectNo
                this.dataForm.contractNo = data.project.contractNo
                this.dataForm.projectName = data.project.projectName
                this.dataForm.projectMoney = data.project.projectMoney
                this.dataForm.projectAuthorize = data.project.projectAuthorize
                this.dataForm.projectNote = data.project.projectNote
                this.dataForm.projectBusiness = data.project.projectBusiness
                this.dataForm.examineNote = data.project.examineNote
                this.dataForm.projectType = data.project.projectType
                this.dataForm.projectStage = data.project.projectStage
                this.dataForm.projectProduce = data.project.projectProduce
                this.dataForm.pStage = data.project.pStage
                this.dataForm.projectProduceAccount = data.project.projectProduceAccount
                this.dataForm.produceGroupId = data.project.produceGroupId
                this.dataForm.projectProduceId = data.project.projectProduceId
                this.dataForm.projectStartDateTime = data.project.projectStartDateTime
                this.dataForm.projectCreateDateTime = data.project.projectCreateDateTime
                this.dataForm.createuserid = data.project.createuserid
                this.getWorkTypelist(data.project.projectNo).then(list => {
                  this.workTypelist = list
                  this.getPlanByProjectNo()
                })
              }
            })
          } else {
            // 新增项目 获取项目号
            this.getProjectNo(item.contractNo).then(projectNo => {
              this.dataForm.projectNo = projectNo
              this.getWorkTypelist(projectNo).then(list => {
                this.workTypelist = list
                this.getPlanByProjectNo()
              })
            })
            this.dataForm.contractNo = item.contractNo
            this.dataForm.projectName = item.contractName
            this.dataForm.projectMoney = item.contractMoney
            this.dataForm.projectAuthorize = item.contractAuthorize
            this.dataForm.projectNote = item.contractNote
            this.dataForm.projectBusiness = item.contractBusiness
            this.dataForm.projectType = item.projectType
            this.dataForm.projectProduceId = ''
            this.dataForm.produceGroupId = ''
            this.dataForm.projectProduce = ''
          }

      },
      // 编辑预算产值
      editOutputHandle () {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.outputAddOrUpdate.init(this.dataForm)
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs.dataForm.validateAll().then(
          success => {
              // 项目负责人
              //this.dataForm.projectProduce = this.produceList.find(produce => produce.userId === this.dataForm.projectProduceId)['username']
              console.log('项目负责人ID' + this.dataForm.projectProduceId, '项目负责人' + this.dataForm.projectProduce)
              this.$http({
                url: this.$http.adornUrl(`/project/project/${!this.dataForm.id ? 'save' : 'update'}`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id || undefined,
                  'projectNo': this.dataForm.projectNo,
                  'contractNo': this.dataForm.contractNo,
                  'projectName': this.dataForm.projectName,
                  'projectMoney': this.dataForm.projectMoney,
                  'projectAuthorize': this.dataForm.projectAuthorize,
                  'projectNote': this.dataForm.projectNote,
                  'projectBusiness': this.dataForm.projectBusiness,
                  'pStage': this.dataForm.pStage,
                  'examineNote': this.dataForm.examineNote,
                  'projectType': this.dataForm.projectType,
                  'projectStage': this.dataForm.projectStage,
                  'projectProduce': this.dataForm.projectProduce,
                  'projectProduceAccount': this.dataForm.projectProduceAccount,
                  'projectProduceId': this.dataForm.projectProduceId,
                  'produceGroupId': this.dataForm.produceGroupId,
                  'projectStartDateTime': this.dataForm.projectStartDateTime,
                  'outputRemark': this.dataForm.outputRemark,
                  'createuserid': this.dataForm.createuserid
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.postProjectPlanHandle().then(success => {
                    this.$notify({ type: 'success', message: '操作成功'})
                    this.visible = false
                    this.$emit('refreshDataList', this.dataForm.contractNo)
                  })
                } else {
                  this.$notify({message: data.msg, type: 'danger'})
                }
              })
          }
        )
      },
      // 添加项目 获取项目编号
      getProjectNo (contractNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/getProjectNo`),
            method: 'get',
            params: this.$http.adornParams({ 'contractNo': contractNo })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.projectNo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取生产负责人列表
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
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取一级部门列表
      getWorkgroupList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/workgroup/list`),
            method: 'get',
            params: this.$http.adornParams({
              pid: 12
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 选择部门发生的事件，默认选择生产负责人的是经理或副经理
      groupChangeHandle () {
        for (let group of this.groupList) {
          if (group.id === this.dataForm.produceGroupId) {
            this.produceList = []
            if (!stringIsNull(group.headId)) {
              this.produceList.push({
                userId: group.headId,
                username: group.headMan
              })
            }
            if (!stringIsNull(group.deputyId)) {
              this.produceList.push({
                userId: group.deputyId,
                username: group.deputyLeader
              })
            }
          }
        }
        console.log(this.produceList)
        this.dataForm.projectProduceId = ''
      },
      // 获取预算产值工作类型列表
      getWorkTypelist (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/checkoutputtemp/list`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$notify({message: data.msg, type: 'danger',duration: 3000})
              reject(data.msg)
            }
          })
        })
      },
      // 预算产值设置后
      refreshOutputHandle (projectNo, totalOutPut, outputRemark) {
        this.getWorkTypelist(projectNo).then(list => {
          this.workTypelist = list
          this.dataForm.projectOutput = totalOutPut
          this.dataForm.outputRemark = outputRemark
        })
      },
      // 工作类型在表格勾选显示
      chooseRatio (params) {
        //  console.log(params)
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
      // 保留小数点后两位的过滤器，尾数不四舍五入
      numFilter (value) {
        // 截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3)
        let realVal = tempVal.substring(0, tempVal.length - 1)
        return realVal
      },
      // 工作安排预算产值
      postProjectPlanHandle () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/plan/saveTemp`),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': this.dataForm.projectNo,
              'projectOutput': this.dataForm.projectOutput
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 获取项目计划
      getPlanByProjectNo () {
        return new Promise((resolve, reject) => {
          if (this.dataForm.projectNo) {
            this.$http({
              url: this.$http.adornUrl(`/project/plan/info/${this.dataForm.projectNo}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.projectPlan != null) {
                  this.dataForm.projectOutput = data.projectPlan.projectOutput
                }
                resolve(data)
              } else {
                this.$message.error(data.msg)
                reject(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
