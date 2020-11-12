<template>
  <div v-loading="loading" element-loading-text="扫码加载中...">
    <van-row type="flex" justify="space-between" align="bottom" style="margin-bottom:5px; padding:4px 0px;">
      <van-col span="1" />
      <van-col span="15">
        <van-search class="searchCon" v-model="dataForm.key" @input="pageIndex=1,getDataList()"
                    @cancel="pageIndex=1,dataForm.key = '' " show-action placeholder="搜索关键词..."/>
      </van-col>
      <van-col span="8" class="addcontract">
        <div style="float:right;margin-right:20px;">
          <van-button type="info" @click="pageIndex=1,getDataList()">查询</van-button>
        </div>
      </van-col>
    </van-row>
    <van-row type="flex" justify="space-between" align="bottom" style="margin-bottom:5px; padding:4px 0px;">
      <van-col span="1" />
      <van-col span="8" class="addcontract">
        <van-button v-if="isAuth('dop:device:save')" type="info" @click="addOrUpdateHandle()" icon="plus">添加设备</van-button>
      </van-col>
      <van-col span="8" class="addcontract">
        <van-button type="info" icon="enlarge" @click="wxScanHandle">扫码查询</van-button>
      </van-col>
      <van-col span="7" />
    </van-row>
    <el-table :data="dataList" border v-loading="dataListLoading" @sort-change="changeSort" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="序号ID" width="91"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="deviceName" header-align="center" align="center" label="仪器名称" width="110"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="factoryNum" header-align="center" align="center" label="出厂编号"></el-table-column>
      <el-table-column prop="factoryName" header-align="center" align="center" label="生产厂家"></el-table-column>
      <el-table-column prop="specNum" header-align="center" align="center" label="型号规格"></el-table-column>
      <el-table-column prop="accuracy" header-align="center" align="center" label="标称精度"></el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="购置金额" width="110"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="buyTime" header-align="center" align="center" label="购置时间" width="110"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="indate" header-align="center" align="center" label="有效期">
        <template slot-scope="scope">
          <span v-if="scope.row.indate != null">{{scope.row.indate}}年</span>
        </template>
      </el-table-column>
      <el-table-column prop="devStation" header-align="center" align="center" label="设备状况" width="100">
        <template slot-scope="scope" >
          <el-tag v-if="scope.row.devStation === 0" size="small" type="success">闲置中</el-tag>
          <el-tag v-else-if="scope.row.devStation === 1" size="small" type="warning">出借中</el-tag>
          <el-tag v-else-if="scope.row.devStation === 2" size="small" type="danger">维修中</el-tag>
          <el-tag v-else-if="scope.row.devStation === 3" size="small" type="info">已丢失</el-tag>
          <el-tag v-else-if="scope.row.devStation === 4" size="small" type="info">已报废</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column header-align="center" align="center" label="二维码"  width="90">
        <template slot-scope="scope">
          <span class="check_span" @click="qrCodeShowHandle(scope.row)">查看</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" header-align="center" align="center" label="仪器证书" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.fileName != null && scope.row.fileName != ''" class="check_span" @click="fileLoadToHandle(scope.row.fileName)">查看</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="借还记录" width="100">
        <template slot-scope="scope">
          <span class="check_span" @click="dopHistoryHandle(scope.row)">查看</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="90" fixed="right" label="操作">
        <template slot-scope="scope">
          <div class="device_btn"><el-button size="mini" @click="lendProcessHandle(scope.row)" type="primary">借记</el-button></div>
          <div class="device_btn"><el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button></div>
          <div class="device_btn"><el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button></div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float: right"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[25, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, prev, pager, next">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 二维码弹窗 -->
    <device-qrcode v-if="qrcodeVisible" ref="deviceQrcode"></device-qrcode>
    <!-- 仪器借记历史弹窗 -->
    <device-history v-if="historyVisible" ref="deviceHistory"></device-history>
    <!-- 借记流程弹窗 -->
    <device-process v-if="processVisible" ref="deviceProcess" @refreshDataList="getDataList"></device-process>
    <!-- 借换记录弹窗 -->
    <history-add-or-update v-if="historyAddOrUpdateVisible" ref="historyAddOrUpdate"></history-add-or-update>

  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import {stringIsNull} from '@/utils'
  import deviceQrcode from './device-qrcode'
  import deviceHistory from './device-history'
  import deviceProcess from './device-process'
  import AddOrUpdate from './device-add-or-update'
  import historyAddOrUpdate from './history-add-or-update'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc'
        },
        loading: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        qrcodeVisible: false,
        processVisible: false,
        historyVisible: false,
        historyAddOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      deviceQrcode,
      deviceHistory,
      deviceProcess,
      historyAddOrUpdate
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 排序字段改变
      changeSort (val) {
        console.log(val)
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/dop/device/page'),
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
          } else {
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$dialog.confirm({
          title: '提示',
          message: `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/dop/device/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 仪器借还记录
      dopHistoryHandle (item) {
        this.historyVisible = true
        this.$nextTick(() => {
          this.$refs.deviceHistory.init(item)
        })
      },
      // 仪器借记流程
      lendProcessHandle (item) {
        this.processVisible = true
        this.$nextTick(() => {
          this.$refs.deviceProcess.init(item)
        })
      },
      // 查看仪器文件
      fileLoadToHandle (fileName) {
        window.open(window.SITE_CONFIG['uploadUrl'] + 'dop/' + fileName)
      },
      // 二维码显示
      qrCodeShowHandle (item) {
        this.qrcodeVisible = true
        this.$nextTick(() => {
          this.$refs.deviceQrcode.init(item)
        })
      },
      // 通过出厂编号 获取仪器设备
      getDeviceInfo (code) {
        this.$http({
          url: this.$http.adornUrl('/dop/device/getInfoByNum'),
          method: 'get',
          params: this.$http.adornParams({
            factoryNum: code
          })
        }).then(({data}) => {
          if (data.code === 0) {
            this.lendProcessHandle(data.dopDevice)
          }
        })
      },
      // 微信扫码事件
      wxScanHandle () {
        let that = this
        this.loading = true
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/wx/getWxToken'),
            method: 'get',
            params: this.$http.adornParams({
              wechaturl: window.location.href.split('#')[0]
            })
          }).then(({data}) => {
            var msg = ''
            if (data.code === 0) {
              msg = data.sign
              wx.config({
                beta: true,
                debug: false,
                appId: msg.appId,
                timestamp: msg.timestamp,
                nonceStr: msg.nonceStr,
                signature: msg.signature,
                jsApiList: ['checkJsApi', 'scanQRCode']// 微信扫一扫接口]// 扫描二维码功能
              })
              wx.ready(function () {
                // config信息验证成功后会执行ready方法,所有接口调用都必须在config接口获得结果之后
                // config 是一个客户端的异步操作,所以如果需要在页面加载时调用相关接口,则须把相关接口放在ready函数中调用来确保正确执行.对于用户触发是才调用的接口,则可以直接调用,不需要放在ready函数中
                wx.checkJsApi({ // 判断当前客户端版本是否支持指定JS接口
                  jsApiList: [
                    'scanQRCode'
                  ],
                  success: function (res) {
                    that.loading = false
                    if (res.checkResult.scanQRCode === true) {
                      wx.scanQRCode({ // 微信扫一扫接口
                        desc: 'scanQRCode desc',
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                          that.getDeviceInfo(res.resultStr)
                          // const getCode = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                        }
                      })
                    } else {
                      that.loading = false
                      that.$notify({ type: 'danger', message: '抱歉，当前客户端版本不支持扫一扫' })
                    }
                  },
                  fail: function (res) { // 检测getNetworkType该功能失败时处理
                    that.loading = false
                    that.$notify({ type: 'danger', message: '扫码失败了' })
                  }
                })
              })
              /* 处理失败验证 */
              wx.error(function (res) {
                that.$notify({ type: 'danger', message: '配置验证失败' })
              })
            } else {
              that.loading = false
            }
            resolve(data)
          })
        })
      }
    }
  }
</script>

<style scoped>
  .van-tabs--line .van-tabs__wrap {
    height: 44px;
  }
  .toptab .van-tabs__wrap .van-tabs__nav .van-tab {
    position: relative;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    box-sizing: border-box;
    min-width: 0;
    padding: 0 5px;
    color: #646566;
    font-size: 15px;
    line-height: 44px;
    text-align: center;
    cursor: pointer;
  }
  .van-tabs__nav--line {
    box-sizing: content-box;
    padding-bottom: 10px;
  }
  .toptab .van-cell {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 7px 13px;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
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
  .van-search__content {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    background-color: #f7f8fa;
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
  .device_btn {
    padding: 2px;
  }
  .check_span {
    color: #2BCBBB;
    text-decoration: underline;
  }
</style>
