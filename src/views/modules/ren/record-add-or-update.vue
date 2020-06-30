<template>
  <div>
    <van-dialog title='编辑个人档案' use-slot show-cancel-button v-model="visible" confirm-button-text="提交"
                v-if="visible" @cancel="canCelDialogEvent" @confirm="dataFormSubmit" :beforeClose="beforeClose">
      <div :style="'max-height: ' + (documentClientHeight - 200).toString() + 'px'" style="overflow-y: auto;" class="record_content">
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
          <van-field v-model="dataForm.sex" label="性别" name="sex" :rules="[{ required: true, message: '请选择性别' }]">
            <template slot="input">
              <input type="radio"  v-model="dataForm.sex" id="s1" value="1"  style="zoom:2;width:9px;"/>男
              <input type="radio"  v-model="dataForm.sex" id="s2" value="2"  style="zoom:2;margin-left: 6px;width:9px;"/>女
            </template>
          </van-field>
          <van-field label="身份证号" v-model="dataForm.idNo" type="number" name="idNo"
                     placeholder="身份证号" :rules="[{ required: true, message: '请填写身份证信息' }]"/>
          <van-field label="生日" v-model="dataForm.birthday" name="birthday" clickable @click="birthdayShow = true" readonly
                     placeholder="出生日期" :rules="[{ required: true, message: '请填写生日信息' }]"/>
          <van-field label="籍贯" v-model="nativePlaceName" name="nativePlace" clickable @click="areaShow = true" readonly
                     placeholder="请选择籍贯" :rules="[{ required: true, message: '请填写籍贯' }]"/>
          <van-field label="婚姻状况" v-model="maritalStatusName" name="maritalStatus" clickable @click="hyShow = true" readonly
                     placeholder="请选择婚姻状况" :rules="[{ required: true, message: '请填写婚姻状况' }]"/>
          <van-field label="手机号" v-model="dataForm.mobile" type="tel" name="mobile"
                     placeholder="手机号" :rules="[{ required: true, message: '请填写手机号码' }]"/>
          <van-field label="邮箱" v-model="dataForm.email"  name="email"
                     placeholder="邮箱" :rules="[{ required: true, message: '请填写正确的邮箱' }]"/>
          <van-field label="入职时间" v-model="dataForm.entryTime" name="entryTime"@click="entryTimeShow=true" readonly
                     placeholder="入职时间" :rules="[{ required:true, message: '请选择入职时间' }]"/>
          <van-field label="试用期(月)" v-model="dataForm.trialPeriod" name="trialPeriod"  type="digit"
                     placeholder="试用期(月)" :rules="[{ required:true, message: '试用期（月）不能为空' }]"/>
          <van-field v-model="dataForm.houseType" label="住房类型" :rules="[{ required:true, message: '住房类型不能为空' }]">
            <template slot="input">
              <input type="radio"  v-model="dataForm.houseType" id="h1" value="1"  style="zoom:2;width:9px;"/>本地居民
              <input type="radio"  v-model="dataForm.houseType" id="h2" value="2"  style="zoom:2;margin-left: 6px;width:9px;"/>租房
            </template>
          </van-field>
          <van-field v-model="zcLevelName" label="职称等级" name="zcLevelName" @click="zcLevelShow = true" readonly
                     placeholder="请选择职称等级" :rules="[{ required:true, message: '职称等级不能为空' }]"/>
          <van-field v-model="zcxName" label="职称专业系数" name="zcxName" @click="zcxShow = true" readonly
                     placeholder="请选择职称专业系数" :rules="[{ required:true, message: '职称专业系数不能为空' }]"/>
          <van-field v-model="jobTypeName" label="工作类型" name="jobType" @click="jobTypeShow = true" readonly
                     placeholder="请选择工作类型" :rules="[{ required:true, message: '工作类型不能为空' }]"/>
          <van-field v-model="zwName" label="职务"  name="dutyId"  @click="dutyShow = true" readonly
                     placeholder="请选择职务" :rules="[{ required:true, message: '请填写职务' }]"/>
          <van-field v-model="educationName" label="最高学历"  name="education"  @click="edShow = true" readonly
                     placeholder="最高学历" :rules="[{ required:true, message: '请填写最高学历' }]"/>
          <van-field v-model="edTypeName" label="学制"  name="educationType"  @click="edTypeShow = true" readonly
                     placeholder="学制" :rules="[{ required:true, message: '请填写学制' }]"/>
          <van-field v-model="proName" label="专业系数"  name="proRatio" @click="proRatioShow = true" readonly
                     placeholder="专业系数" :rules="[{ required:true, message: '请填写专业系数' }]"/>
          <van-field v-model="dataForm.educationTime" label="毕业时间"  name="educationTime" @click="edTimeShow = true" readonly
                     placeholder="请选择毕业时间" :rules="[{ required:true, message: '请填写毕业时间' }]"/>
        </van-form>
        <!--教育背景部分-->
        <div style="margin-top:5px;margin-bottom:5px;">
          <van-button icon="plus" type="info" size="small" @click="edBackgroundAddHandle">添加教育背景</van-button>
        </div>
          <div :key="item + index" v-for="(item,index) in dataForm.edBackgroundList" class="row_content">
            <van-row type="flex" align="bottom" justify="end" style="margin-top:10px;padding-bottom:5px;">
              <van-col span="17">
                <van-field v-model="item.monthRangeDate[0]" label="开始时间:" @click="egStartTimeAddEvent(index)"  disabled/>
                <van-field v-model="item.monthRangeDate[1]" label="结束时间:" @click="egEndTimeAddEvent(index)"  disabled/>
                <van-field v-model="item.educationBackground" label="学历:"  />
                <van-field v-model="item.educationSchool" label="学校:"  />
                <van-field v-model="item.major" label="专业:"  />
              </van-col>
              <van-col span="6"><van-button type="danger" size="small" @click="edBackgroundDeleteHandle(item.edId)">删除</van-button></van-col>
            </van-row>
          </div>
        <!--工作经验部分-->
        <div style="margin-top:5px;margin-bottom:5px;">
          <van-button icon="plus" type="info" size="small" @click="workBackgroundAddHandle">添加工作经历</van-button>
        </div>
          <div :key="item + index" v-for="(item,index) in dataForm.workBackgroundList" class="row_content">
            <van-row type="flex" align="bottom" justify="end" style="margin-top:10px;padding-bottom:5px;">
              <van-col span="17">
                <van-field v-model="item.monthRangeDate[0]" label="开始时间:" @click="wxStartTimeAddEvent(index)"  disabled/>
                <van-field v-model="item.monthRangeDate[1]" label="结束时间:" @click="wxEndTimeAddEvent(index)" disabled/>
                <van-field v-model="item.company" label="企业:"  />
                <van-field v-model="item.jobPosition" label="职位:"  />
                <van-field v-model="item.jobDescription" label="工作描述:"  />
              </van-col>
              <van-col span="6"><van-button type="danger" size="small" @click="workBackgroundDeleteHandle(item.wbId)">删除</van-button></van-col>
            </van-row>
          </div>
        <!---->
      </div>
    </van-dialog>

    <!-- 省市控件-->
    <van-popup v-model="areaShow" position="bottom" :style="{ height: '50%' }">
      <van-area title="选择省市" :area-list="areaList" :columns-num="2" @cancel="areaShow = false" @confirm="placeChangeHandle" />
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
    <!--婚姻状况选择器-->
    <van-popup v-model="hyShow" position="bottom" :style="{ height: '50%' }" ref="jobTypeId">
      <van-picker title="选择婚姻状况" show-toolbar @cancel="hyShow=false" value-key="dateItem" :columns="maritalItemList"  @confirm="onHyConfirm" />
    </van-popup>
    <!-- 工作类型选择器-->
    <van-popup v-model="jobTypeShow" position="bottom" :style="{ height: '50%' }" ref="jobTypeId">
      <van-picker title="选择工作类型" show-toolbar @cancel="jobTypeShow=false" value-key="jobItem" :columns="jobItemList"  @confirm="onJobTypeConfirm" />
    </van-popup>
    <!--职称等级选择器-->
    <van-popup v-model="zcLevelShow" position="bottom" :style="{ height: '50%' }" ref="jobTypeId">
      <van-picker title="选择职称等级" show-toolbar @cancel="zcLevelShow=false" value-key="jobTitle" :columns="titleItemList"  @confirm="onZcConfirm" />
    </van-popup>
    <!--职称专业系数选择器-->
    <van-popup v-model="zcxShow" position="bottom" :style="{ height: '50%' }" ref="jobTypeId">
      <van-picker title="职称专业系数" show-toolbar @cancel="zcxShow=false" value-key="jobTitle" :columns="titleProList"  @confirm="onZcxConfirm" />
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
      <van-datetime-picker type="date" title="选择毕业时间" @cancel="edTimeShow=false" @confirm="onEdTimeConfirm"
                           :min-date="new Date(1970,0,1)" :max-date="new Date(2080,11,31)" />
    </van-popup>

    <!--单条教育背景日期选择器-->
    <van-popup v-model="egStartTimeAddShow" position="bottom" :style="{ height: '50%' }" ref="edTypeId">
      <van-datetime-picker type="year-month" title="开始时间"
                           :min-date="this.egSelectStartTimeList[egTimeAddIndex].selectMin" :max-date="this.egSelectStartTimeList[egTimeAddIndex].selectMax"
                           @cancel="egStartTimeAddShow=false" @confirm="oneEgStartTimeAddConfirm"/>
    </van-popup>
    <van-popup v-model="egEndTimeAddShow" position="bottom" :style="{ height: '50%' }" ref="edTypeId">
      <van-datetime-picker type="year-month" title="结束时间"
                           :min-date="this.egSelectEndTimeList[egTimeAddIndex].selectMin" :max-date="this.egSelectEndTimeList[egTimeAddIndex].selectMax"
                           @cancel="egEndTimeAddShow=false" @confirm="oneEgEndTimeAddConfirm"/>
    </van-popup>
    <!--单条工作经历日期选择器-->
    <van-popup v-model="wxStartTimeAddShow" position="bottom" :style="{ height: '50%' }" ref="edTypeId">
      <van-datetime-picker type="year-month" title="开始时间"
                           :min-date="this.wxSelectStartTimeList[wxTimeAddIndex].selectMin" :max-date="this.wxSelectStartTimeList[wxTimeAddIndex].selectMax"
                           @cancel="wxStartTimeAddShow=false" @confirm="oneWxStartTimeAddConfirm"/>
    </van-popup>
    <van-popup v-model="wxEndTimeAddShow" position="bottom" :style="{ height: '50%' }" ref="edTypeId">
      <van-datetime-picker type="year-month" title="结束时间"
                           :min-date="this.wxSelectEndTimeList[wxTimeAddIndex].selectMin" :max-date="this.wxSelectEndTimeList[wxTimeAddIndex].selectMax"
                           @cancel="wxEndTimeAddShow=false" @confirm="oneWxEndTimeAddConfirm"/>
    </van-popup>

  </div>
</template>

<script>
  import {provinceAndCityData} from 'element-china-area-data'
  import moment from 'moment'
  import lrz from 'lrz'
  import { getUUID } from '@/utils'
  import {getMaritalItem, getJobItem} from '@/utils/selectedItem'
  import {areaList} from '@/utils/areaList'
  export default {
    data () {
      return {
        egSelectStartTimeList: [], // 教育背景提供开始选择
        egSelectEndTimeList: [], // 教育背景提供结束选择
        egStartTimeAddShow: false,
        egEndTimeAddShow: false,
        egTimeAddIndex: 0, // 暂存变量 下标
        wxSelectStartTimeList: [],
        wxSelectEndTimeList: [],
        wxStartTimeAddShow: false,
        wxEndTimeAddShow: false,
        wxTimeAddIndex: 0, // 暂存变量 下标
        jobTypeName: '',
        educationName: '', // 最高学历
        edTypeName: '', // 学制
        proName: '', // 专业系数
        zcxName: '', // 职称系数名称
        zwName: '', // 职务名称
        maritalStatusName: '', // 婚姻状况
        zcLevelName: '', // 职称等级
        nativePlaceName: '', // 籍贯名称
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
        zcxShow: false,
        hyShow: false, // 婚姻状况
        zcLevelShow: false,
        areaList: areaList,
        loading: true,
        loadingtext: '正在加载中',
        imgLoading: false,   // 图片加载
        maritalItemList: getMaritalItem(),
        jobItemList: getJobItem(),
        proItemList: [],
        edItemList: [],
        edTypeItemList: [],
        dutyItemList: [], // 职务列表
        titleItemList: [], // 职称列表
        titleProList: [],
        placeOptions: provinceAndCityData,
        dataForm: {
          userId: 0,
          sex: 1,
          idNo: '',
          birthday: '',
          entryTime: '',
          jobType: '',
          houseType: '',
          dutyId: '',
          proRatio: '',
          education: '',
          educationType: '',
          educationTime: '',
          titleLever: '',
          titlePro: '',
          email: '',
          mobile: '',
          trialPeriod: '',
          nativePlace: '',
          nativeProvince: '',
          nativeCity: '',
          maritalStatus: '',
          headImg: '',
          edBackgroundList: [],
          workBackgroundList: []
        }
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
    },
    methods: {
      egStartTimeAddEvent (index) {
        this.egTimeAddIndex = index
        this.egStartTimeAddShow = true
      },
      egEndTimeAddEvent (index) {
        this.egTimeAddIndex = index
        this.egEndTimeAddShow = true
      },
      wxStartTimeAddEvent (index) {
        this.wxTimeAddIndex = index
        this.wxStartTimeAddShow = true
      },
      wxEndTimeAddEvent (index) {
        this.wxTimeAddIndex = index
        this.wxEndTimeAddShow = true
      },
      oneEgStartTimeAddConfirm (date) {
        this.dataForm.edBackgroundList[this.egTimeAddIndex].monthRangeDate[0] = moment(date).format('YYYY-MM')
        // 时间控件设置 结束最小 时间 起码要大于 选中日期 一个月
        this.egSelectEndTimeList[this.egTimeAddIndex].selectMin = new Date(date.getFullYear(), date.getMonth() + 1)
        this.egStartTimeAddShow = false
      },
      oneEgEndTimeAddConfirm (date) {
        this.dataForm.edBackgroundList[this.egTimeAddIndex].monthRangeDate[1] = moment(date).format('YYYY-MM')
        // 时间控件设置 开始最大 时间 起码要小于 选中日期 一个月
        this.egSelectStartTimeList[this.egTimeAddIndex].selectMax = new Date(date.getFullYear(), date.getMonth() - 1)
        this.egEndTimeAddShow = false
      },
      oneWxStartTimeAddConfirm (date) {
        this.dataForm.workBackgroundList[this.wxTimeAddIndex].monthRangeDate[0] = moment(date).format('YYYY-MM')
        // 时间控件设置 结束最小 时间 起码要大于 选中日期 一个月
        this.wxSelectEndTimeList[this.wxTimeAddIndex].selectMin = new Date(date.getFullYear(), date.getMonth() + 1)
        this.wxStartTimeAddShow = false
      },
      oneWxEndTimeAddConfirm (date) {
        this.dataForm.workBackgroundList[this.wxTimeAddIndex].monthRangeDate[1] = moment(date).format('YYYY-MM')
        // 时间控件设置 开始最大 时间 起码要小于 选中日期 一个月
        this.wxSelectStartTimeList[this.wxTimeAddIndex].selectMax = new Date(date.getFullYear(), date.getMonth() - 1)
        this.wxEndTimeAddShow = false
      },
      asyncValidator (val) {
        return new Promise((resolve) => {
          // this.$toast.loading('验证中...')
          // this.$toast.clear()
          resolve(/^(((13[0-9]{1})|(14[57]{1})|(15[012356789]{1})|(17[03678]{1})|(18[0-9]{1})|(19[89]{1})|(16[6]{1}))+\d{8})$/.test(val))
        })
      },
      // 窗口关闭前的动作
      beforeClose (action, done) {
        console.log(this.visible)
        done(!this.visible)
      },
      // 籍贯选择器
      placeChangeHandle (area) {
        console.log(area)
        this.dataForm.nativeProvince = area[0].code
        this.dataForm.nativeCity = area[1].code
        this.dataForm.nativePlace = area[0].name + area[1].name
        this.nativePlaceName = area[0].name + area[1].name
        this.areaShow = false
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
      onZcConfirm (item) {
        this.zcLevelName = item.jobTitle
        this.dataForm.titleLever = item.id
        this.zcLevelShow = false
      },
      onZcxConfirm (item) {
        this.zcxName = item.jobTitle
        this.dataForm.titlePro = item.id
        this.zcxShow = false
      },
      onHyConfirm (item) {
        this.maritalStatusName = item.dateItem
        this.dataForm.maritalStatus = item.id
        this.hyShow = false
      },
      // 学历选择
      onEdConfirm (item) {
        this.educationName = item.scoreName
        this.dataForm.education = item.id
        this.edShow = false
      },
      // 学制选择器
      onEdTypeConfirm (item) {
        this.dataForm.educationType = item.id
        this.edTypeName = item.scoreName
        this.edTypeShow = false
      },
      // 专业系数
      onProConfirm (item) {
        this.dataForm.proRatio = item.id
        this.proName = item.scoreName
        this.proRatioShow = false
      },
      // 工作类型选择
      onJobTypeConfirm (item) {
        this.dataForm.jobType = item.id
        this.jobTypeName = item.jobItem
        this.jobTypeShow = false
      },
      // 职务选择
      onDutyConfirm (item) {
        this.dataForm.dutyId = item.id
        this.dutyName = item.duty
        this.dutyShow = false
      },
      // 毕业时间选择
      onEdTimeConfirm (date) {
        console.log(date)
        this.dataForm.educationTime = moment(date).format('YYYY-MM-DD')
        console.log(this.dataForm.educationTime)
        this.edTimeShow = false
      },
      // 获取省市名称
      getPlaceName (nProvinceId, nCityId) {
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
      },
      init (id) {
        this.dataForm.userId = id || 0
        this.visible = true
        this.$nextTick(() => {
          // 学历对照表信息
          this.getScoreEdList(1).then(edTypeList => {
            this.edTypeItemList = edTypeList
            this.getScoreEdList(2).then(proItemList => {
              this.proItemList = proItemList
              this.getScoreEdList(3).then(edList => {
                this.edItemList = edList
                this.getJobTypeList(1).then(titleList => {
                  this.titleItemList = titleList
                  this.getJobTypeList(2).then(titleProList => {
                    this.titleProList = titleProList
                    this.getScoreDutyList().then(dutyList => {
                      this.dutyItemList = dutyList
                      this.loading = true
                      this.loadingtext = '正在加载中'
                      if (this.dataForm.userId) {
                        this.$http({
                          url: this.$http.adornUrl(`/ren/record/info/${this.dataForm.userId}`),
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
                            this.dataForm.jobType = data.renRecordVo.jobType
                            this.dataForm.houseType = data.renRecordVo.houseType
                            this.dataForm.education = data.renRecordVo.education
                            this.dataForm.educationType = data.renRecordVo.educationType
                            this.dataForm.educationTime = data.renRecordVo.educationTime
                            this.dataForm.proRatio = data.renRecordVo.proRatio
                            this.dataForm.titleLever = data.renRecordVo.titleLever
                            this.dataForm.titlePro = data.renRecordVo.titlePro
                            this.dataForm.dutyId = data.renRecordVo.dutyId
                            this.dataForm.email = data.renRecordVo.email
                            this.dataForm.mobile = data.renRecordVo.mobile
                            this.dataForm.trialPeriod = data.renRecordVo.trialPeriod
                            this.dataForm.nativeProvince = data.renRecordVo.nativeProvince
                            this.dataForm.nativeCity = data.renRecordVo.nativeCity
                            this.dataForm.nativePlace = data.renRecordVo.nativeProvince === null ? null : [data.renRecordVo.nativeProvince, data.renRecordVo.nativeCity]
                            this.dataForm.maritalStatus = data.renRecordVo.maritalStatus
                            this.dataForm.headImg = data.renRecordVo.headImg
                            // 籍贯 回显
                            if (this.dataForm.nativePlace !== null) {
                              let sprovince = this.dataForm.nativePlace[0]
                              let scity = this.dataForm.nativePlace[1]
                              let provincelist = areaList.province_list
                              let citylist = areaList.city_list
                              this.nativePlaceName += provincelist[sprovince]
                              this.nativePlaceName += citylist[scity]
                            }
                            for (let edBackground of data.renRecordVo.edBackgroundList) {
                              edBackground.edId = getUUID()
                              edBackground.monthRangeDate = [edBackground.startDate, edBackground.endDate]
                            }
                            for (let wBackground of data.renRecordVo.workBackgroundList) {
                              wBackground.wbId = getUUID()
                              wBackground.monthRangeDate = [wBackground.startDate, wBackground.endDate]
                            }
                            for (let item of this.dutyItemList) {
                              if (item.id === this.dataForm.dutyId) {
                                this.zwName = item.duty
                              }
                            }
                            for (let item of this.jobItemList) {
                              if (item.id === this.dataForm.jobType) {
                                this.jobTypeName = item.jobItem
                              }
                            }
                            // 最高学历 回显
                            for (let item of this.edItemList) {
                              if (item.id === this.dataForm.education) {
                                this.educationName = item.scoreName
                              }
                            }
                            // 学制 回显
                            for (let item of this.edTypeItemList) {
                              if (item.id === this.dataForm.educationType) {
                                this.edTypeName = item.scoreName
                              }
                            }
                            // 专业系数 回显
                            for (let item of this.proItemList) {
                              if (item.id === this.dataForm.proRatio) {
                                this.proName = item.scoreName
                              }
                            }
                            // 婚姻状况 回显
                            for (let item of this.maritalItemList) {
                              if (item.id === this.dataForm.maritalStatus) {
                                this.maritalStatusName = item.dateItem
                              }
                            }
                            // 职称等级 回显
                            for (let item of this.titleItemList) {
                              if (item.id === this.dataForm.titleLever) {
                                this.zcLevelName = item.jobTitle
                              }
                            }
                            for (let item of this.titleProList) {
                              if (item.id === this.dataForm.titlePro) {
                                this.zcxName = item.jobTitle
                              }
                            }
                            this.dataForm.edBackgroundList = data.renRecordVo.edBackgroundList
                            this.dataForm.workBackgroundList = data.renRecordVo.workBackgroundList
                            if (this.dataForm.edBackgroundList.length === 0) {
                              this.egSelectStartTimeList.push({
                                selectMin: new Date(1970, 0, 1),
                                selectMax: new Date(2080, 11, 31)
                              })
                              this.egSelectEndTimeList.push({
                                selectMin: new Date(1970, 0, 1),
                                selectMax: new Date(2080, 11, 31)
                              })
                            } else {
                              for (let size = 0; size < this.dataForm.edBackgroundList.length; size++) {
                                this.egSelectStartTimeList.push({
                                  selectMin: new Date(1970, 0, 1),
                                  selectMax: new Date(2080, 11, 31)
                                })
                                this.egSelectEndTimeList.push({
                                  selectMin: new Date(1970, 0, 1),
                                  selectMax: new Date(2080, 11, 31)
                                })
                              }
                            }
                            //
                            if (this.dataForm.workBackgroundList.length === 0) {
                              this.wxSelectStartTimeList.push({
                                selectMin: new Date(1970, 0, 1),
                                selectMax: new Date(2080, 11, 31)
                              })
                              this.wxSelectEndTimeList.push({
                                selectMin: new Date(1970, 0, 1),
                                selectMax: new Date(2080, 11, 31)
                              })
                            } else {
                              for (let size = 0; size < this.dataForm.workBackgroundList.length; size++) {
                                this.wxSelectStartTimeList.push({
                                  selectMin: new Date(1970, 0, 1),
                                  selectMax: new Date(2080, 11, 31)
                                })
                                this.wxSelectEndTimeList.push({
                                  selectMin: new Date(1970, 0, 1),
                                  selectMax: new Date(2080, 11, 31)
                                })
                              }
                            }
                          }
                        })
                      }
                    })
                  })
                })
              })
            })
          })
        })
      },
      // 关闭对话框事件
      canCelDialogEvent () {
        this.visible = false
        this.maritalStatusName = ' '
        this.zcLevelName = ' '
        this.zcxName = ' '
        this.jobTypeName = ' '
        this.zwName = ' '
        this.educationName = ' '
        this.edTypeName = ' '
        this.edTypeName = ' '
        this.proName = ' '
        this.nativePlaceName = ' '
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs.dataForm.validateAll().then(
          success => {
            for (let edBackground of this.dataForm.edBackgroundList) {
              edBackground.startDate = edBackground.monthRangeDate[0]
              edBackground.endDate = edBackground.monthRangeDate[1]
            }
            for (let wBackground of this.dataForm.workBackgroundList) {
              wBackground.startDate = wBackground.monthRangeDate[0]
              wBackground.endDate = wBackground.monthRangeDate[1]
            }
            console.log(this.dataForm.educationTime)
            this.loading = true
            this.loadingtext = '正在上传中'
            this.$http({
              url: this.$http.adornUrl(`/ren/record/save`),
              method: 'post',
              data: this.$http.adornData({
                'renRecordEntity': this.dataForm,
                'edBackgroundList': this.dataForm.edBackgroundList,
                'workBackgroundList': this.dataForm.workBackgroundList
              })
            }).then(({data}) => {
              this.loading = false
              if (data && data.code === 0) {
                this.$notify({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.visible = false
                this.$emit('refreshDataList')
              } else {
                this.$notify.error(data.msg)
              }
            })
          })
      },
      // 添加教育背景
      edBackgroundAddHandle () {
        this.dataForm.edBackgroundList.push({
          edId: getUUID(),
          userId: this.dataForm.userId,
          monthRangeDate: ['', ''],
          // monthRangeDate: [''],
          educationBackground: '',
          educationSchool: '',
          major: ''
        })
        this.egSelectStartTimeList.push({
          selectMin: new Date(1970, 0, 1),
          selectMax: new Date(2080, 11, 31)
        })
        this.egSelectEndTimeList.push({
          selectMin: new Date(1970, 0, 1),
          selectMax: new Date(2080, 11, 31)
        })
        console.log(this.dataForm.edBackgroundList)
      },
      // 删除教育背景
      edBackgroundDeleteHandle (edId) {
        let edTmpeList = []
        for (let edBackground of this.dataForm.edBackgroundList) {
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
          monthRangeDate: ['', ''],
          company: '',
          jobPosition: '',
          jobDescription: ''
        })
        this.wxSelectStartTimeList.push({
          selectMin: new Date(1970, 0, 1),
          selectMax: new Date(2080, 11, 31)
        })
        this.wxSelectEndTimeList.push({
          selectMin: new Date(1970, 0, 1),
          selectMax: new Date(2080, 11, 31)
        })
      },
      // 删除工作经验
      workBackgroundDeleteHandle (wbId) {
        let workBackTempList = []
        for (let wbground of this.dataForm.workBackgroundList) {
          if (wbground.wbId !== wbId) {
            workBackTempList.push(wbground)
          }
        }
        this.dataForm.workBackgroundList = workBackTempList
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
      getJobTypeList (cateId) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/scoretitle/list'),
            method: 'get',
            params: this.$http.adornParams({
              cateid: cateId
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
      // 图片压缩处理
      compressImgHandle (e) {
        let that = this
        if (e.target.files && e.target.files.length === 1) {
          let options = {
            quality: 0.5,
            width: 900,
            height: 900
          }
          lrz(e.target.files[0], options)
            .then(function (rst) {
              // 成功时执行
              that.dataForm.headImg = rst.base64
              console.log(rst.base64)
            }).catch(function (error) {
            // 失败时执行
              that.$message.error('上传图片有误，请重新上传！')
            }).always(function () {
            // 不管成功或失败，都会执行
            })
        }
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
  .tac{
    text-align:center;
  }
  .flh25{
    float:left;line-height:25px;
  }
  .sf14{
    font-size:14px;
  }
  .row_content{
    border-top:1px dotted black;
  }
  .record_content .van-cell{
    padding:7px 13px;
  }
  .row_content .van-cell{
    padding:2px;
  }

</style>
