<template>
  <div>
    <div class="header_button">
      <van-button icon="user-o" type="primary"  @click="editRecordHandle">编辑个人档案</van-button>
      <van-button icon="setting-o" type="info"  @click="updatePasswordHandle">修改密码</van-button>
      <van-button icon="wap-home-o" type="danger" @click="logoutHandle">退出</van-button>
    </div>
    <div class="mod_card" style="text-align: center;">
      <div v-if="userDetail.isAudit != null" style="font-size: 12pt;"><span>审核状态：</span>
        <el-popover placement="top" width="160" v-model="auditvisible" v-if="userDetail.isAudit == 2" title="审核反馈意见">
          <p style="color: red">{{userDetail.auditMsg}}</p>
          <div style="text-align: right; margin: 0">
            <el-button type="primary" size="mini" @click="auditvisible = false">确定</el-button>
          </div>
          <span  slot="reference" type="danger" class="home_text_unpassed">未通过</span>
        </el-popover>
        <el-tag type="success" v-if="userDetail.isAudit == 1">已通过</el-tag>
        <el-tag  v-if="userDetail.isAudit == 0" type="warning">未审核</el-tag>
        <el-button v-if="userDetail.isAudit == 0" type="warning" size="small" @click="deleteAudit()"> 撤销审核 </el-button>
      </div>
      <!-- 基本信息表 -->
      <table border="1" bordercolor="black" width="100%" class="home_title" cellpadding="0" cellspacing="0" >
        <tr>
          <th colspan="4">基本信息</th>
        </tr>
        <tr>
          <td>账号：</td><td><span style="font-weight: 700;">{{userDetail.useraccount}}</span></td>
          <td colspan="2" rowspan="5"><img :src="userDetail.headImg" style="width: 90%;" alt /></td>
        </tr>
        <tr>
          <td>姓名：</td><td><span>{{userDetail.username}}</span></td>
        </tr>
        <tr>
          <td>性别：</td><td><span>{{userDetail.sex  == 1? '男': '女'}}</span></td>
        </tr>
        <tr>
          <td>工作类型：</td>
          <td>
            <span v-if="userDetail.jobType == 1">全职</span>
            <span v-if="userDetail.jobType == 2">兼职</span>
            <span v-if="userDetail.jobType == 3">实习</span>
          </td>
        </tr>
        <tr>
          <td>住房类型：</td>
          <td>
            <span v-if="userDetail.houseType == 1">本地居民</span>
            <span v-if="userDetail.houseType == 2">租房</span>
          </td>
        </tr>
        <tr>
          <td>出生日期:</td><td colspan="3"><span>{{userDetail.birthday}}</span></td>
        </tr>
        <tr>
          <td>身份证号:</td><td colspan="3"><span>{{userDetail.idNo}}</span></td>
        </tr>
        <tr>
          <td>联系电话:</td><td colspan="3"><span>{{userDetail.mobile}}</span></td>
        </tr>
        <tr>
          <td>邮箱:</td><td colspan="3"><span>{{userDetail.email}}</span></td>
        </tr>
        <tr>
          <td>婚姻状况:</td>
          <td>
            <span v-if="userDetail.maritalStatus == 0">未婚</span>
            <span v-if="userDetail.maritalStatus == 1">已婚</span>
            <span v-if="userDetail.maritalStatus == 2">离异</span>
            <span v-if="userDetail.maritalStatus == 3">丧偶</span>
          </td>
          <td>籍贯:</td><td><span>{{getPlaceName(userDetail.nativeProvince,userDetail.nativeCity).replace('省','').replace('市','')}}</span></td>
        </tr>
        <tr>
          <td>职务:</td><td><span>{{userDetail.duty}}</span></td>
          <td>职称:</td><td><span>{{userDetail.titleName}}</span></td>
        </tr>
        <tr>
          <td>入职时间:</td><td colspan="3"><span>{{userDetail.entryTime}}</span></td>
        </tr>
        <tr>
          <td>最高学历:</td><td><span>{{userDetail.edName}}</span></td>
          <td>学制:</td><td><span>{{userDetail.edType}}</span></td>
        </tr>
        <tr><th colspan="4">教育背景</th></tr>
        <tr v-if="edBackgroundList.length === 0"><td colspan="4">暂无信息</td></tr>
        <tr>
          <td>起止时间</td><td>毕业学校</td><td>学历</td><td>专业</td>
        </tr>
        <tr v-for="(v,i) in edBackgroundList" :key="i">
          <td><span>{{v.startDate}}至{{v.endDate}}</span></td><td><span>{{v.educationSchool}}</span></td><td><span>{{v.educationBackground}}</span></td><td><span>{{v.major}}</span></td>
        </tr>
        <tr><th colspan="4">工作经历</th></tr>
        <tr v-if="workBackgroundList.length === 0"><td colspan="4">暂无信息</td></tr>
        <tr v-for="(v,i) in workBackgroundList" :key="i">
          <td><span>{{v.startDate}}至{{v.endDate}}</span></td><td><span>{{v.company}}</span></td><td><span>{{v.jobPosition}}</span></td><td><span>{{v.jobDescription}}</span></td>
        </tr>
      </table>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <!-- 弹窗, 编辑个人资料 -->
    <rencord-temp-add-or-update v-if="rencordTempVisible" ref="rencordTempAddOrUpdate" @refreshDataList="getUserDetailFromApi"></rencord-temp-add-or-update>
  </div>
</template>

<script>
  import {provinceAndCityData} from 'element-china-area-data'
  import UpdatePassword from '../main-navbar-update-password'
  import RencordTempAddOrUpdate from '../modules/ren/recordtemp-add-or-update'
  import momnet from 'moment'
  import { clearLoginInfo } from '@/utils'

  export default {
    data () {
      return {
        placeOptions: provinceAndCityData,
        rencordTempVisible: false,
        updatePassowrdVisible: false,
        auditvisible: false,
        edBackgroundList:[],
        workBackgroundList:[],
        proItemList: [],
        edItemList: [],
        edTypeItemList: [],
        dutyItemList: [], // 职务列表
        titleItemList: [], // 职称列表
        loadTime: momnet(new Date()).format('YYYY-MM-DD hh:mm:ss')
      }
    },
    components: {
      UpdatePassword,
      RencordTempAddOrUpdate
    },
    computed: {
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userDetail: {
        get () { return this.$store.state.user.userDetail },
        set (val) { this.$store.commit('user/updateUserDetail', val) }
      }
    },
    created () {
      // 学历对照表信息
      this.getScoreEdList(1).then(edTypeList => {
        this.getScoreEdList(2).then(proList => {
          this.getScoreEdList(3).then(edItemList => {
            this.getTitleList().then(titleList => {
              this.getScoreDutyList().then(dutyList => {
                this.edTypeItemList = edTypeList
                this.proItemList = proList
                this.edItemList = edItemList
                this.titleItemList = titleList
                this.dutyItemList = dutyList
                this.getUserDetailFromApi()
              })
            })
          })
        })
      })
    },
    methods: {
      // 获取个人信息
      getUserDetailFromApi () {
        this.$http({
          url: this.$http.adornUrl(`/ren/recordtemp/info/${this.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.userDetail = data.renRecordVo
            this.userDetail.edName = this.edItemList.find(item => item.id === data.renRecordVo.education).scoreName
            this.userDetail.edType = this.edTypeItemList.find(item => item.id === data.renRecordVo.educationType).scoreName
            this.userDetail.proItem = this.proItemList.find(item => item.id === data.renRecordVo.proRatio).scoreName
            this.userDetail.titleName = this.titleItemList.find(item => item.id === data.renRecordVo.titleLever).jobTitle
            this.userDetail.duty = this.dutyItemList.find(item => item.id === data.renRecordVo.dutyId).duty
            this.edBackgroundList = this.userDetail.edBackgroundList
            this.workBackgroundList = this.userDetail.workBackgroundList
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 撤销审核
      deleteAudit () {
        this.$confirm('是否撤销当前个人资料的编辑', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/ren/recordtemp/deleteAudit'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '撤销成功',
                type: 'success',
                duration: 1500
              })
              this.getUserDetailFromApi()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
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
      getTitleList () {
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
      // 编辑个人资料
      editRecordHandle () {
        this.rencordTempVisible = true
        this.$nextTick(() => {
          this.$refs.rencordTempAddOrUpdate.init(this.userId , 0)
        })
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$dialog.confirm({
          title: '标题',
          message: '确定进行[退出]操作?'
        }).then(() => {
          clearLoginInfo()
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$router.push({ name: 'login' })
            }
          })
        }).catch(() => {})
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
  .header_button {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }
  .home_title{
    table-layout: fixed;
    margin-top: 3px;
    margin-bottom: 10px;
  }
  .home_title tr th{
    font-size: 14pt;
    font-weight: 700;
    padding: 5px;
  }
  .home_title tr td{
    font-size: 12pt;
  }
  .home_title tr td span{
    color: #3b97d7;
  }
  .titlepstyle {
    height: 30px;
    width: 90px;
    line-height: 30px;
    font-size: 15.5px;
    font-family: 微软雅黑;
    text-align: center;
    /* font-weight: 540; */
    font-weight: bold;
  }
  .onetdtitlestyle {
    height: 35px;
    width: 105px;
    line-height: 35px;
    font-size: 21px;
    font-family: Arial, Verdana, Sans-serif;
    font-weight: bold;
    text-align: center;
    margin-left: 350px;
  }
  .contentpstyle {
    padding: 2px;
    font-family: 宋体;
    color: rgb(0, 0, 0);
    font-style: normal;
    font-size: 18px;
    display: block;
    float: left;
    text-align: center;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    word-wrap: break-word;
  }
  .contentpstylelasttwo {
    padding: 2px;
    font-family: 宋体;
    color: rgb(0, 0, 0);
    font-style: normal;
    font-size: 16px;
    display: block;
    float: left;
    text-align: center;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    word-wrap: break-word;
  }
  /**审核图片样式 */
  .audit_img_style {
    width: 150px;
    height: 120px;
    position: absolute;
    left: 70px;
  }
  /**审核意见卡片样式 */
  .audit_opinion_card {
    width: 150px;
    height: 100px;
    position: absolute;
    left: 30px;
    top: 200px;
  }
  /**审核意见标题样式 */
  .title_of_audit_opinion_style {
    float: left;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  /**审核意见内容样式 */
  .contents_of_audit_opinions_style {
    float: left;
    font: 13px Extra Small;
    margin-left: 22px;
  }
</style>

