<template>
  <div>
    <div v-if="loadFlag" class="load_style">
      <van-loading size="40px">加载中...</van-loading>
    </div>
  <div v-else>
    <div style="width:90%;margin: 0 auto; margin-top:10px;margin-bottom:5px;">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="margin-right:10px;">
          <el-input v-model="dataForm.key" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="pageIndex=1,getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="yg_info">员工信息</div>
    <div :style="'max-height: ' + (documentClientHeight - 180).toString() + 'px'" style="overflow: scroll;">
      <div v-for="(item,indexA) in dataList">
        <van-collapse v-model="activeNames" @change="recordLoadHandle(item)">
          <van-collapse-item :name="item.userId">
            <template slot="title">
              <van-row>
                <van-col span="24">
                  <van-row type="flex" align="center" justify="center">
                    <van-col span="10" style="text-align: center;">
                      <van-image width="100" height="100" :src="item.headImg" />
                    </van-col>
                    <van-col span="14">
                      <van-row><van-col span="24" class="title_info_font">用户ID:{{item.userId}}</van-col></van-row>
                      <van-row><van-col span="24" class="title_info_font">账号:{{item.useraccount}}</van-col></van-row>
                      <van-row><van-col span="24" class="title_info_font">姓名:{{item.username}}</van-col></van-row>
                      <van-row><van-col span="24" class="title_info_font">邮箱:{{item.email}}</van-col></van-row>
                      <van-row><van-col span="24" class="title_info_font">手机号:{{item.mobile}}</van-col></van-row>
                    </van-col>
                  </van-row>
                </van-col>
              </van-row>
            </template>
            <div style="padding:0px 16px 0px 16px;">
              <div class="zl">
                <span>详细资料</span>
                <van-button size="small" type="info" @click="addOrUpdateHandle(item.userId)" style="float:right;">编辑资料</van-button>
                <van-button type="danger" size="small" @click="auditHandle(item.userId)" v-if="item.isAudit === 0">待审核</van-button>
              </div>
              <van-row class="card_name_title">
                <van-col span="6">身份证号:</van-col>
                <van-col span="18"><span class="span_style">{{item.idNo}}</span></van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6"> 性别:</van-col>
                <van-col span="18">
                  <van-tag v-if="item.sex === 1" type="primary">男</van-tag>
                  <van-tag v-else-if="item.sex === 2" type="warning">女</van-tag>
                </van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6">出生日期:</van-col>
                <van-col span="18"><span class="span_style">{{item.birthday}}</span></van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6">籍贯:</van-col>
                <van-col span="18"><span class="span_style">{{getPlaceName(item.nativeProvince,item.nativeCity)}}</span></van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6">婚姻情况:</van-col>
                <van-col span="18">
                  <van-tag v-if="item.maritalStatus === 0" type="success">未婚</van-tag>
                  <van-tag v-else-if="item.maritalStatus === 1" type="primary">已婚</van-tag>
                  <van-tag v-else-if="item.maritalStatus === 2" type="warning">离异</van-tag>
                  <van-tag v-else-if="item.maritalStatus === 3" type="danger">丧偶</van-tag>
                </van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6">最高学历:</van-col>
                <van-col span="18"><span class="span_style">{{item.edName}}/{{item.edTypeName}}</span></van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6">入职时间:</van-col>
                <van-col span="18"><span class="span_style">{{item.entryTime }}</span></van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6">试用期:</van-col>
                <van-col span="18"><span class="span_style">{{item.trialPeriod}} 个月</span></van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6">职务:</van-col>
                <van-col span="18"><span class="span_style">{{item.dutyName}}</span></van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6">工作类型:</van-col>
                <van-col span="18">
                  <van-tag v-if="item.jobType === 1" type="primary">全职</van-tag>
                  <van-tag v-if="item.jobType === 2" type="success">兼职</van-tag>
                  <van-tag v-if="item.jobType === 3" type="danger">实习</van-tag>
                </van-col>
              </van-row>
              <van-row class="card_name_title">
                <van-col span="6">职称等级:</van-col>
                <van-col span="18"><span class="span_style">{{item.titleName}}</span></van-col>
              </van-row>
              <!--<div>查看更多>></div>-->
              <van-row type="flex" align="center" justify="center">
                <van-col span="8">查看更多>></van-col>
                <van-col span="8" class="tac">
                  <van-button type="info" size="small" @click="ebClickEvent(item)">教育背景</van-button>
                </van-col>
                <van-col span="8" class="tac">
                  <van-button type="info" size="small" @click="jeClickEvent(item)">工作经历</van-button>
                </van-col>

              </van-row>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <!--分页控件-->
    <van-pagination v-model="pageIndex" items-per-page = "25" :total-items="totalPage" mode="simple" @change="getDataList()" />
  </div>

    <van-dialog v-model="jybjShow" confirm-button-text ="返回">
      <remplate slot="title">
        <div style="font-weight:600;font-size:17px;">教育背景</div>
      </remplate>
      <record-list-module typeNum = "1" :dataList="passDataList" :titleList = "titleList[0]"/>
    </van-dialog>
    <van-dialog v-model="gzjyShow" confirm-button-text ="返回">
      <remplate slot="title">
        <div style="font-weight:600;font-size:17px;">工作经验</div>
      </remplate>
      <record-list-module typeNum = "2" :dataList = "passDataList" :titleList = "titleList[1]"/>
    </van-dialog>
    <!-- 弹窗, 新增 / 修改 个人资料 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!--审核 个人资料 -->
    <rencord-temp-add-or-update v-if="rencordTempVisible" ref="rencordTempAddOrUpdate" @refreshDataList="getDataList"></rencord-temp-add-or-update>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import AddOrUpdate from './record-add-or-update'
  import RencordTempAddOrUpdate from './recordtemp-add-or-update'
  import {provinceAndCityData} from 'element-china-area-data'
  import RecordListModule from '@/components/record-list-module'

  export default {
    data () {
      return {
         loadFlag: false,
        activeNames: [],
        // 教育背景
        jybjShow: false,
        // 工作经验
        gzjyShow: false,
        // 接收数据
        passDataList: [],
        titleList: [
          ['日期', '学历', '学校', '专业'],
          ['日期', '企业', '职位', '工作描述']
        ],
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc'
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        infoloading: true, // 个人资料Loading
        dataListSelections: [],
        placeOptions: provinceAndCityData,
        addOrUpdateVisible: false,
        rencordTempVisible: false
      }
    },
    components: {
      AddOrUpdate,
      RencordTempAddOrUpdate,
      RecordListModule
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    created () {
      this.getDataList()
      this.wxParams()
    },
    methods: {
      wxParams() {
        // console.log("输出网址" + location.href.split('#')[0]);
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/wx/getWxToken'),
            //服务器请求路径
            //url: 'https://ren.gdjxch.cn/rensys/sys/wx/getWxToken',
            method: 'get',
            params: this.$http.adornParams({
              wechaturl: window.location.href.split('#')[0]
            })
          }).then(({data}) => {
            var msg = ''
            if (data.code === 0) {
              msg = data.sign
            }
            wx.config({
              beta: true,
              debug: true,
              appId: msg.appId,
              timestamp: msg.timestamp,
              nonceStr: msg.nonceStr,
              signature: msg.signature,
              jsApiList: ['checkJsApi', 'scanQRCode']// 微信扫一扫接口]// 扫描二维码功能
            })
            console.log('appid: ' + msg.appid)
            console.log('timestamp: ' + msg.timestamp)
            console.log('nonceStr: ' + msg.nonceStr)
            console.log('signature: ' + msg.signature)
            console.log(data)
            wx.ready(function () {
              // config信息验证成功后会执行ready方法,所有接口调用都必须在config接口获得结果之后
              // config 是一个客户端的异步操作,所以如果需要在页面加载时调用相关接口,则须把相关接口放在ready函数中调用来确保正确执行.对于用户触发是才调用的接口,则可以直接调用,不需要放在ready函数中
              wx.checkJsApi({ // 判断当前客户端版本是否支持指定JS接口
                jsApiList: [
                  'scanQRCode'
                ],
                success: function (res) {
                  if (res.checkResult.scanQRCode === true) {
                    wx.scanQRCode({ // 微信扫一扫接口
                      desc: 'scanQRCode desc',
                      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                      success: function (res) {
                        const getCode = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                      }
                    })
                  } else {
                    alert('抱歉，当前客户端版本不支持扫一扫')
                  }
                },
                fail: function (res) { // 检测getNetworkType该功能失败时处理
                  alert('fail失败了' + res)
                }
              })
            })

            /* 处理失败验证 */
            wx.error(function (res) {
              alert('配置验证失败: ' + res.errMsg)
            })
            resolve(data)
          })
        })
      },
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
        this.dataForm.sidx = val.prop
        this.getDataList()
      },
      ebClickEvent (item) {
        this.recordLoadHandle(item).then(success => {
          this.passDataList = item.edBackgroundList
          this.jybjShow = true
        })
      },
      jeClickEvent (item) {
        this.recordLoadHandle(item).then(success => {
          this.passDataList = item.workBackgroundList
          this.gzjyShow = true
        })
      },
      // 获取数据列表
      getDataList () {
        this.loadFlag = true
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/ren/record/page'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
            this.loadFlag = false
          } else {
            this.$message.error(data.msg)
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 审核步骤
      auditHandle (userId) {
        this.rencordTempVisible = true
        this.$nextTick(() => {
          this.$refs.rencordTempAddOrUpdate.init(userId, 1)
        })
      },

      // 获取个人详细资料
      recordLoadHandle (row) {
        return new Promise((resolve, reject) => {
          this.infoloading = true
          this.$http({
            url: this.$http.adornUrl(`/ren/record/info/${row.userId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.infoloading = false
            if (data && data.code === 0) {
              row.username = data.renRecordVo.username
              row.idNo = data.renRecordVo.idNo
              row.sex = data.renRecordVo.sex
              row.birthday = data.renRecordVo.birthday
              row.entryTime = data.renRecordVo.entryTime
              row.jobType = data.renRecordVo.jobType
              row.houseType = data.renRecordVo.houseType
              row.education = data.renRecordVo.education
              row.titleLever = data.renRecordVo.titleLever
              row.email = data.renRecordVo.email
              row.mobile = data.renRecordVo.mobile
              row.trialPeriod = data.renRecordVo.trialPeriod
              row.nativeProvince = data.renRecordVo.nativeProvince
              row.nativeCity = data.renRecordVo.nativeCity
              row.nativePlace = [data.renRecordVo.nativeProvince, data.renRecordVo.nativeCity]
              row.maritalStatus = data.renRecordVo.maritalStatus
              row.headImg = data.renRecordVo.headImg
              row.edBackgroundList = data.renRecordVo.edBackgroundList
              row.workBackgroundList = data.renRecordVo.workBackgroundList
              row.edName = data.renRecordVo.edName
              row.edTypeName = data.renRecordVo.edTypeName
              row.dutyName = data.renRecordVo.dutyName
              row.titleName = data.renRecordVo.titleName
              // return row
            }
            resolve(data)
          })
        })
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
      }
    }
  }
</script>

<style scoped>
  .title_info_font{
    padding-bottom:1px;
  }
  .title_info_font:first-child{
    padding-top:1px;
  }
  .van-cell{
    padding:8px 16px;
  }
  .card_name_title{
    padding-bottom:3px;
    font-weight:600;
    color:black;
  }
  .span_style{
    font-weight:400;
  }
  .tac{
    text-align:center;
  }
  .el-form-item{
    padding:0px;
    margin:0px;
  }
  .yg_info{
    width:90%;font-size:15px;font-weight:600;border-bottom:1px solid dodgerblue;padding-bottom:2px;margin: 0 auto 1px;
  }
  .load_style{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .van-loading__text{
    font-size:16px;
  }
  .zl{
    display: flex;
    justify-content: space-between;
    color:#4c4e51;padding-bottom:2px;margin-bottom:2px;font-size:16px;border-bottom:1px solid dodgerblue;
  }
</style>
