<template>
  <div>
    <van-dialog title='编辑个人档案' use-slot show-cancel-button v-model="visible" confirm-button-text="提交"
                @cancel="visible = false" @confirm="dataFormSubmit" :beforeClose="beforeClose">
      <div :style="'max-height: ' + (documentClientHeight - 200).toString() + 'px'" style="overflow-y: auto;"
            v-loading="loading">
        <van-form  ref="dataForm">
          <van-field v-model="dataForm.headImg" name="headImg" label="个人头像" disabled>
            <template slot="input">
              <div class="person_img" v-loading="imgLoading">
                <div class="img_content">
                  <img :src="dataForm.headImg" alt="" />
                  <div class="card_detail_img_add" >
                    <i class="el-icon-plus addplus"></i>
                    <div class="img_input">
                      <input type="file" accept="image/*" @change="compressImgHandle" ></input>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </van-field>
          <van-field  v-model="dataForm.username"  label="姓名" name="username" disabled>
            <span style="color: #3b97d7">{{dataForm.username}}</span>
          </van-field>
          <van-field v-model="dataForm.sex" label="性别">
            <template slot="input">
              <input type="radio"  v-model="dataForm.sex" id="s1" value="1"  style="zoom:2;width:9px;"/>男
              <input type="radio"  v-model="dataForm.sex" id="s2" value="2"  style="zoom:2;margin-left: 6px;width:9px;"/>女
            </template>
          </van-field>
          <van-field label="生日" v-model="dataForm.birthday" name="birthday" readonly clickable placeholder="请选择生日" @click="birthdayShow=true"></van-field>
          <van-field label="籍贯" v-model="dataForm.nativePlace" name="username" clickable placeholder="请选择籍贯" @click="areaShow=true"></van-field>
          <van-field label="身份证号" v-model="dataForm.idNo" name="idNo" placeholder="请填写身份证号码"></van-field>
          <van-field label="手机号" v-model="dataForm.mobile" name="mobile" placeholder="填写手机号" type="digit"></van-field>
          <van-field label="电子邮件" v-model="dataForm.email"  name="email" placeholder="电子邮件"></van-field>
          <van-field label="入职时间" v-model="dataForm.entryTime" name="entryTime" placeholder="入职时间" @click="entryTimeShow=true" readonly clickable></van-field>
          <van-field label="试用期(月)" v-model="dataForm.trialPeriod" name="trialPeriod" placeholder="试用期(月)" type="digit"></van-field>
          <van-field v-model="dataForm.houseType" label="住房类型">
            <template slot="input">
              <input type="radio"  v-model="dataForm.houseType" id="h1" value="1"  style="zoom:2;width:9px;"/>本地居民
              <input type="radio"  v-model="dataForm.houseType" id="h2" value="2"  style="zoom:2;margin-left: 6px;width:9px;"/>租房
            </template>
          </van-field>
          <van-field v-model="dataForm.jobTypeName" label="工作类型" placeholder="工作类型" name="jobType" @click="jobTypeShow = true" readonly clickable></van-field>
          <van-field v-model="dataForm.dutyName" label="职务" placeholder="职务" name="dutyId"  @click="dutyShow = true" readonly clickable></van-field>
          <van-field v-model="dataForm.edName" label="最高学历" placeholder="最高学历" name="education"  @click="edShow = true" readonly clickable></van-field>
          <van-field v-model="dataForm.edTypeName" label="学制" placeholder="学制" name="educationType"  @click="edTypeShow = true" readonly clickable></van-field>
          <van-field v-model="dataForm.proName" label="专业系数" placeholder="专业系数" name="proRatio" @click="proRatioShow = true" readonly clickable></van-field>
          <van-field v-model="dataForm.educationTime" label="毕业时间" placeholder="毕业时间" name="educationTime" @click="edTimeShow = true" readonly clickable></van-field>
        </van-form>
      </div>
    </van-dialog>
    <!-- 省市控件-->
    <van-popup v-model="areaShow" position="bottom" :style="{ height: '50%' }">
      <van-area title="选择省市" :area-list="areaList" :columns-num="2" @cancel="areaShow=false" @confirm="placeChangeHandle" />
    </van-popup>
    <!-- 入职时间日历控件-->
    <van-calendar v-model="entryTimeShow" :default-date="dataForm.entryTime == ''?new Date(): new Date(dataForm.entryTime)"
                  :min-date="new Date(2010,0,1)" :max-date="new Date(2050,11,31)"
                  @confirm="onEntryTimeConfirm" color="#1989fa" />
    <!-- 出生时间日历控件-->
    <van-popup v-model="birthdayShow" position="bottom" :style="{ height: '50%' }" ref="birthdayId">
      <van-datetime-picker   type="date" title="选择生日" @cancel="birthdayShow=false" @confirm="onBirthdayConfirm"
                           :min-date="new Date(1950,0,1)" :max-date="new Date(2030,11,31)"/>
    </van-popup>
    <!-- 工作类型选择器-->
    <van-popup v-model="jobTypeShow" position="bottom" :style="{ height: '50%' }" ref="jobTypeId">
      <van-picker title="选择工作类型" show-toolbar @cancel="jobTypeShow=false" value-key="jobItem" :columns="jobItemList"  @confirm="onJobTypeConfirm" />
    </van-popup>
    <!-- 职务选择器-->
    <van-popup v-model="dutyShow" position="bottom" :style="{ height: '50%' }" ref="dutyId">
      <van-picker title="选择职务" show-toolbar @cancel="dutyShow=false" value-key="duty" :columns="dutyItemList"  @confirm="onDutyConfirm" />
    </van-popup>
    <!-- 学历选择器 -->
    <van-popup v-model="edShow" position="bottom" :style="{ height: '50%' }" ref="edTypeId">
      <van-picker title="选择学历" show-toolbar @cancel="edShow=false" value-key="scoreName" :columns="edItemList" @confirm="onEdConfirm" />
    </van-popup>
    <!-- 学制选择器 -->
    <van-popup v-model="edTypeShow" position="bottom" :style="{ height: '50%' }" ref="edTypeId">
      <van-picker title="选择学制" show-toolbar @cancel="edTypeShow=false" value-key="scoreName" :columns="edTypeItemList" @confirm="onEdTypeConfirm" />
    </van-popup>
    <!-- 专业系数选择器 -->
    <van-popup v-model="proRatioShow" position="bottom" :style="{ height: '50%' }" ref="edTypeId">
      <van-picker title="选择专业系数" show-toolbar @cancel="proRatioShow=false" value-key="scoreName" :columns="proItemList" @confirm="onProConfirm" />
    </van-popup>
    <!-- 毕业时间 -->
    <van-popup v-model="edTimeShow" position="bottom" :style="{ height: '50%' }" ref="edTimeId">
      <van-datetime-picker type="year-month" title="选择毕业时间" @cancel="edTimeShow=false" @confirm="onEdTimeConfirm"
                           :min-date="new Date(1970,0,1)" :max-date="new Date(2080,11,31)" />
    </van-popup>
  </div>
</template>

<script>
  import {provinceAndCityData} from 'element-china-area-data'
  import moment from 'moment'
  import lrz from 'lrz'
  import {getUUID , stringIsNull} from '@/utils'
  import {areaList} from '@/utils/areaList'
  import {getJobItem, getMaritalItem} from '@/utils/selectedItem'

  export default {
    data () {
      return {
        visible: false,
        areaShow: false,
        entryTimeShow: false,
        birthdayShow: false,
        jobTypeShow: false,
        dutyShow: false,
        edShow: false,
        edTypeShow: false,
        edTimeShow: false,
        proRatioShow: false,
        areaList: areaList,
        recordeductionVisible: false,
        recordworkVisible: false,
        returnAuditVisible: false,
        loading: true,
        imgLoading: false,
        loadingtext: '正在加载中',
        proItemList: [],
        edItemList: [],
        edTypeItemList: [],
        dutyItemList: [], // 职务列表
        titleItemList: [], // 职称列表
        jobItemList: getJobItem(),
        maritalItemList: getMaritalItem(),
        placeOptions: provinceAndCityData,
        auditForm: {
          auditMsg: ''
        },
        dataForm: {
          userId: 0,
          username: '',
          sex: 1,
          idNo: '',
          birthday: '',
          entryTime: '',
          jobType: '',
          jobTypeName: '',
          houseType: '',
          dutyId: '',
          dutyName: '',
          proRatio: '',
          proName: '',
          education: '',
          educationType: '',
          educationTime: '',
          titleLever: '',
          email: '',
          mobile: '',
          trialPeriod: '',
          nativePlace: '',
          nativeProvince: '',
          nativeCity: '',
          maritalStatus: '',
          headImg: '',
          isAudit: '',
          auditMsg: '',
          edBackgroundList: [],
          workBackgroundList: []
        },
        auditRule: {
          aduitMsg: [{required: true, message: '审核返退意见不能为空', trigger: 'blur'}]
        },
        dataRule: {
          idNo: [
            {required: true, message: '身份证号不能为空', trigger: 'blur'}
          ],
          birthday: [
            {required: true, message: '出生日期不能为空', trigger: 'blur'}
          ],
          entryTime: [
            {required: true, message: '入职时间不能为空', trigger: 'blur'}
          ],
          jobType: [
            {required: true, message: '工作类型不能为空', trigger: 'blur'}
          ],
          houseType: [
            {required: true, message: '住房类型不能为空', trigger: 'blur'}
          ],
          education: [
            {required: true, message: '最高学历不能为空', trigger: 'blur'}
          ],
          titleLever: [
            {required: true, message: '职称等级不能为空', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '性别不能为空', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '手机号不能为空', trigger: 'blur'}
          ],
          maritalStatus: [
            {required: true, message: '婚姻状况不能为空', trigger: 'blur'}
          ],
          trialPeriod: [
            {required: true, message: '试用期不能为空！', trigger: 'blur'}
          ],
          educationTime: [
            {required: true, message: '毕业时间不能为空！', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
    },
    methods: {
      init( id ,isaudit = 0) {
        this.dataForm.userId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.loading = true
          this.loadingtext = '正在加载中...'
          // 学历对照表信息
          this.getScoreEdList(1).then(edTypeList => {
            this.edTypeItemList = edTypeList
            this.getScoreEdList(2).then(proItemList => {
              this.proItemList = proItemList
              this.getScoreEdList(3).then(edList => {
                this.edItemList = edList
                this.getJobTypeList().then(titleList => {
                  this.titleItemList = titleList
                  this.getScoreDutyList().then(dutyList => {
                    this.dutyItemList = dutyList
                    if (this.dataForm.userId) {
                      this.$http({
                        url: this.$http.adornUrl(`/ren/recordtemp/info/${this.dataForm.userId}`),
                        method: 'get',
                        params: this.$http.adornParams()
                      }).then(({data}) => {
                        this.loading = false
                        if (data && data.code === 0) {
                          this.dataForm.username = data.renRecordVo.username
                          this.dataForm.idNo = data.renRecordVo.idNo
                          this.dataForm.sex = data.renRecordVo.sex
                          this.dataForm.birthday = data.renRecordVo.birthday
                          this.dataForm.entryTime = data.renRecordVo.entryTime
                          this.dataForm.educationTime = data.renRecordVo.educationTime
                          this.dataForm.educationType = data.renRecordVo.educationType
                          this.dataForm.edTypeName = stringIsNull(data.renRecordVo.educationType) ? '' : this.edTypeItemList.find(item => item.id == data.renRecordVo.educationType).scoreName
                          this.dataForm.jobType = data.renRecordVo.jobType
                          this.dataForm.jobTypeName = stringIsNull(data.renRecordVo.jobType) ? '' : this.jobItemList.find(item => item.id == data.renRecordVo.jobType).jobItem
                          this.dataForm.houseType = data.renRecordVo.houseType
                          this.dataForm.education = data.renRecordVo.education
                          this.dataForm.edName = stringIsNull(data.renRecordVo.education) ? '' : this.edItemList.find(item => item.id == data.renRecordVo.education).scoreName
                          this.dataForm.proRatio = data.renRecordVo.proRatio
                          this.dataForm.proName = stringIsNull(data.renRecordVo.proRatio) ? '' : this.proItemList.find(item => item.id == data.renRecordVo.proRatio).scoreName
                          this.dataForm.titleLever = data.renRecordVo.titleLever
                          this.dataForm.email = data.renRecordVo.email
                          this.dataForm.mobile = data.renRecordVo.mobile
                          this.dataForm.trialPeriod = data.renRecordVo.trialPeriod
                          this.dataForm.nativeProvince = data.renRecordVo.nativeProvince
                          this.dataForm.nativeCity = data.renRecordVo.nativeCity
                          this.dataForm.nativePlace = this.getPlaceName(data.renRecordVo.nativeProvince, data.renRecordVo.nativeCity)
                          this.dataForm.maritalStatus = data.renRecordVo.maritalStatus
                          this.dataForm.dutyId = data.renRecordVo.dutyId
                          this.dataForm.dutyName = stringIsNull(data.renRecordVo.dutyId) ? '' : this.dutyItemList.find(item => item.id == data.renRecordVo.dutyId).duty
                          this.dataForm.headImg = data.renRecordVo.headImg
                          this.dataForm.isAudit = isaudit
                          this.dataForm.auditMsg = data.renRecordVo.auditMsg
                          for (let edBackground of data.renRecordVo.edBackgroundList){
                            edBackground.edId = getUUID()
                            edBackground.monthRangeDate = [edBackground.startDate , edBackground.endDate]
                          }
                          for (let wBackground of data.renRecordVo.workBackgroundList){
                            wBackground.wbId = getUUID()
                            wBackground.monthRangeDate = [wBackground.startDate , wBackground.endDate]
                          }
                          this.dataForm.edBackgroundList = data.renRecordVo.edBackgroundList
                          this.dataForm.workBackgroundList = data.renRecordVo.workBackgroundList
                        }
                      })
                    }
                  })
                })
              })
            })
          })
        })
      },
      // 窗口关闭前的动作
      beforeClose (action, done) {
        console.log(this.visible)
        done(!this.visible)
      },
      // 入职时间选择
      onEntryTimeConfirm (date) {
        this.dataForm.entryTime = moment(date).format('YYYY-MM-DD')
        this.entryTimeShow = false
      },
      // 出生时间选择
      onBirthdayConfirm (date) {
        this.dataForm.birthday = moment(date).format('YYYY-MM-DD')
        this.birthdayShow = false
      },
      // 学历选择
      onEdConfirm (item) {
        this.dataForm.education = item.id
        this.dataForm.edName = item.scoreName
        this.edShow = false
      },
      // 学制选择器
      onEdTypeConfirm (item) {
        this.dataForm.educationType = item.id
        this.dataForm.edTypeName = item.scoreName
        this.edTypeShow = false
      },
      // 专业系数
      onProConfirm (item) {
        this.dataForm.proRatio = item.id
        this.dataForm.proName = item.scoreName
        this.proRatioShow = false
      },
      // 工作类型选择
      onJobTypeConfirm (item) {
        this.dataForm.jobType = item.id
        this.dataForm.jobTypeName = item.jobItem
        this.jobTypeShow = false
      },
      // 职务选择
      onDutyConfirm (item) {
        this.dataForm.dutyId = item.id
        this.dataForm.dutyName = item.duty
        this.dutyShow = false
      },
      // 毕业时间选择
      onEdTimeConfirm(date) {
        console.log(date)
        this.dataForm.educationTime = moment(date).format('YYYY-MM')
        this.edTimeShow = false
      },
      // 表单提交
      dataFormSubmit() {
        console.log('eee')
        this.$refs['dataForm'].validateAll().then(
          success =>{
            for (let edBackground of this.dataForm.edBackgroundList){
              edBackground.startDate = moment(edBackground.monthRangeDate[0]).format('YYYY-MM-DD')
              edBackground.endDate = moment(edBackground.monthRangeDate[1]).format('YYYY-MM-DD')
            }
            for (let wBackground of this.dataForm.workBackgroundList){
              wBackground.startDate = moment(wBackground.monthRangeDate[0]).format('YYYY-MM-DD')
              wBackground.endDate = moment(wBackground.monthRangeDate[1]).format('YYYY-MM-DD')
            }
            this.loading = true
            this.loadingtext = '正在上传中'
            this.$http({
              url: this.$http.adornUrl(`/ren/recordtemp/save`),
              method: 'post',
              data: this.$http.adornData({
                'renRecordTempEntity': this.dataForm,
                'edBackgroundList': this.dataForm.edBackgroundList,
                'workBackgroundList': this.dataForm.workBackgroundList
              })
            }).then(({data}) => {
              this.loading = false
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.visible = false
                this.$emit('refreshDataList')
              } else {
                this.$message.error(data.msg)
              }
            })
        })
      },
      // 退回重改
      returnAuditHandle () {
        this.returnAuditVisible = true
      },
      // 退回重改意见
      auditFormSubmit(){
        console.log(this.dataForm.auditMsg)
        if (this.dataForm.auditMsg === undefined || this.dataForm.auditMsg === null){
          this.$message.error('审核反馈意见不能为空！')
          return
        }
        this.$http({
          url: this.$http.adornUrl(`/ren/recordtemp/update`),
          method: 'post',
          data: this.$http.adornData({
            'userId': this.dataForm.userId,
            'auditMsg': this.dataForm.auditMsg,
            'isAudit': 2
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '返退成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
            this.returnAuditVisible = false
            this.$emit('refreshDataList')
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 籍贯选择器
      placeChangeHandle (area) {
        console.log(area)
        this.dataForm.nativeProvince = area[0].code
        this.dataForm.nativeCity = area[1].code
        this.dataForm.nativePlace = area[0].name + area[1].name
        this.areaShow = false
      },
      // 获取学历对照表
      getScoreEdList (cateId) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/scoreed/list'),
            method: 'get',
            params: this.$http.adornParams({
              cateId: cateId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.list)
            }
          })
        })
      },
      // 获取职称表
      getJobTypeList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/scoretitle/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.list)
            }
          })
        })
      },
      // 获取职务列表
      getScoreDutyList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/scoreduty/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.list)
            }
          })
        })
      },
      // 添加教育背景
      edBackgroundAddHandle () {
        this.dataForm.edBackgroundList.push({
          edId: getUUID(),
          userId: this.dataForm.userId,
          monthRangeDate: ['',''],
          educationBackground: '',
          educationSchool: '',
          major: ''
        })
        console.log(this.dataForm.edBackgroundList)
      },
      // 删除教育背景
      edBackgroundDeleteHandle ( edId) {
        let edTmpeList = []
        for (let edBackground of this.dataForm.edBackgroundList){
          if (edBackground.edId !== edId) {
            edTmpeList.push(edBackground)
          }
        }
        this.dataForm.edBackgroundList = edTmpeList
      },
      // 工作经验添加事件
      workBackgroundAddHandle () {
        this.dataForm.workBackgroundList.push({
          wbId: getUUID(),
          userId: this.dataForm.userId,
          monthRangeDate: ['',''],
          company: '',
          jobPosition: '',
          jobDescription: ''
        })
      },
      // 删除工作经验
      workBackgroundDeleteHandle ( wbId) {
        let workBackTempList = []
        for (let wbground of this.dataForm.workBackgroundList){
          if (wbground.wbId !== wbId) {
            workBackTempList.push(wbground)
          }
        }
        this.dataForm.workBackgroundList = workBackTempList
      },
      // 图片压缩处理
      compressImgHandle (e) {
        let that = this
        if (e.target.files) {
          // lrz(file,[ options ])
          let options = {
            quality: 0.5,
            width: 900,
            height: 900
          }
          lrz(e.target.files[0], options)
            .then(function (rst) {
              // 成功时执行
              that.dataForm.headImg = rst.base64
            }).catch(function (error) {
            // 失败时执行
            that.$message.error('上传图片有误，请重新上传！')
          }).always(function () {
            // 不管成功或失败，都会执行
          })
        }
      },
      // 获取省市名称
      getPlaceName(nProvinceId, nCityId) {
        let pName = ''
        for (let provinceOption of this.placeOptions) {
          if (provinceOption.value === nProvinceId) {
            pName += provinceOption.label
            for (let cityOption of provinceOption.children) {
              if (cityOption.value === nCityId) pName += cityOption.label
            }
            break
          }
        }
        return pName
      }
    }
  }
</script>

<style scoped>
  .person_img {
    width: 100%;
    text-align: center;
    display: block;
    position: relative;
  }
  .person_img .img_content {
    width:130px;
    height:173px;
    border: 2px solid dodgerblue;
    border-radius: 10px;
    display:inline-block;
  }
  .person_img .img_content img{
    width:126px;
    height:170px;
    border-radius: 10px;
    position: absolute;
    transform: translate(-50%,0%);
  }
  .person_img .img_input {
    position: absolute;
    cursor: pointer;
    bottom: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
  .person_img .img_input input{
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .card_detail_img_add {
    cursor: pointer;
    height: 40px;
    width: 126px;
    position: absolute;
    bottom: 7px;
    z-index: 2;
    background: #3b4249;
    opacity: 0.5;
    border-radius: 0px 0px 10px 10px;
    -moz-border-radius-bottomleft: 10px;
    -moz-border-radius-bottomright: 10px;
  }

  .card_detail_img_add .addplus {
    color: white;
    width: 30px;
    height: 30px;
    font-weight: 700;
    font-size: 25pt;
    vertical-align: center;
  }

  .card_detail_img_input {
    width: 100%;
    height: 100%;
    z-index: 4;
    opacity: 0;
    cursor: pointer;
  }

  .card_detail_input {
    width: 200px;
  }

  .card_table_title {
    border-bottom: 2px solid #00a2d4;
    font-size: 13pt;
    font-weight: 700;
    margin-top: 10px;
    width: 95%;
    margin-left: 2%;
    display: flex;
    justify-content: space-between;
  }

  .card_table_content {
    width: 95%;
    margin-left: 2%;
  }

  .card_table_title .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

   input[type="radio"]#h1:checked + label::before {
    background-color: #01cd78;
    background-clip: content-box;
    padding: .2em;
  }
</style>

