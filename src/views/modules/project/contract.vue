<template>
  <div >
    <date-module v-model="dataForm" @change="pageIndex=1,getDataList()"></date-module>
    <van-row type="flex" justify="space-between" align="bottom" style="margin-bottom:5px; padding:4px 0px;">
      <van-col span="1" />
      <van-col span="15">
        <van-search class="searchCon" v-model="dataForm.key" @input="pageIndex=1,getDataList()"
                    @cancel="pageIndex=1,dataForm.key = '' " show-action placeholder="搜索关键词..."/>
      </van-col>
      <van-col span="8" class="addcontract">
        <div style="float:right;margin-right:20px;">
          <van-button type="info" @click="addOrUpdateHandle()">添加合同</van-button>
        </div>
      </van-col>
    </van-row>

    <van-row class="pm5b">
      <van-col span="6" class="tac">合同编号</van-col>
      <van-col span="12" class="tac">合同名称</van-col>
      <van-col span="6" class="tac">操作</van-col>
    </van-row>
    <div ref="dataBox" :style="'max-height: ' + (documentClientHeight - 250).toString() + 'px'" class="os">
      <table border="1" class="table_van"  >
        <tbody v-loading="dataListLoading" >
        <tr class="table_excuse" v-if="dataList.length < 1">暂无数据</tr>
        <tr v-for="item in dataList" :key="item.id">
          <td class="table_row_tr1">{{item.contractNo}}</td>
          <td class="table_row_tr2">{{item.contractName}}</td>
          <td class="table_row_tr3" >
            <van-button type="info" size="small" @click="detailContractShow = true,detailContractItem=item" round>详情</van-button>
            <van-button v-if="item.filename" type="primary" size="small" @click="downloadFile(item)" round>下载</van-button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!--分页控件-->
    <div style="margin-top:5px;padding-top:5px;border-top:1px solid rgb(213, 226, 239);">
      <van-pagination v-model="pageIndex" :page-count="totalPage" mode="simple" @change="getDataList()" />
    </div>

    <!--合同详情弹出层-->
    <van-dialog v-model="detailContractShow" confirm-button-text="返回" @cancel="detailContractShow = false">
      <div class="table_detail_info">
        <van-divider contentPosition="center" style="color:#1989FA;">合同信息</van-divider>
        <van-row style="margin-top:10px;">
          <van-col span="7" class="vancoltinfotitlestyle">合同编号:</van-col>
          <van-col span="17" class="vancolinfostyle">{{detailContractItem.contractNo}}</van-col>
        </van-row>
        <van-row style="margin-top:10px;">
          <van-col span="7" class="vancoltinfotitlestyle">合同名称:</van-col>
          <van-col span="17" class="vancolinfostyle">{{detailContractItem.contractName}}</van-col>
        </van-row>
        <van-row style="margin-top:10px;">
          <van-col span="7" class="vancoltinfotitlestyle">合同金额:</van-col>
          <van-col span="17" class="vancolinfostyle">{{detailContractItem.contractMoney}}</van-col>
        </van-row>
        <van-row style="margin-top:10px;">
          <van-col span="7" class="vancoltinfotitlestyle">合同类型:</van-col>
          <van-col span="17" class="vancolinfostyle">{{detailContractItem.contractType == 0? "合同委托" : "一般合同"}}</van-col>
        </van-row>
        <van-row style="margin-top:10px;">
          <van-col span="7" class="vancoltinfotitlestyle">委托单位:</van-col>
          <van-col span="17" class="vancolinfostyle">{{detailContractItem.contractAuthorize}}</van-col>
        </van-row>
        <van-row style="margin-top:10px;">
          <van-col span="7" class="vancoltinfotitlestyle">委托要求:</van-col>
          <van-col span="17" class="vancolinfostyle">{{detailContractItem.contractNote}}</van-col>
        </van-row>
        <van-row style="margin-top:10px;">
          <van-col span="7" class="vancoltinfotitlestyle">业务负责人:</van-col>
          <van-col span="17" class="vancolinfostyle">{{detailContractItem.contractBusiness}}</van-col>
        </van-row>
        <van-row style="margin-top:10px;">
          <van-col span="7" class="vancoltinfotitlestyle">签订时间:</van-col>
          <van-col span="17" class="vancolinfostyle">{{detailContractItem.contractAddTime}}</van-col>
        </van-row>
        <div style="margin-top:20px; margin-bottom:10px;display: flex;justify-content: space-around">
          <van-button type="primary" size="small" @click="addOrUpdateProjectHandle(id = '' ,detailContractItem)" v-if="isAuth('project:project:save')" >添加项目</van-button>
          <van-button type="info" size="small" @click="addOrUpdateHandle(detailContractItem.id)" v-if="isAuth('project:contract:update')" >修改合同</van-button>
          <van-button type="danger" size="small" @click="deleteHandle(detailContractItem)" v-if="isAuth('project:contract:delete')" >删除合同</van-button>
        </div>
        <van-divider contentPosition="center" style="color:#1989FA;">该合同下的项目信息</van-divider>
        <div v-for="item in detailContractItem.projectList">
          <van-row >
            <van-col span="7" class="vancoltinfotitlestyle">项目编号</van-col>
            <van-col span="17" class="vancolinfostyle">{{item.projectNo}}</van-col>
          </van-row>
          <van-row style="margin-top:10px;">
            <van-col span="7" class="vancoltinfotitlestyle">项目名称</van-col>
            <van-col span="17" class="vancolinfostyle">{{item.projectName}}</van-col>
          </van-row>
          <van-row style="margin-top:10px;">
            <van-col span="7" class="vancoltinfotitlestyle">项目启动时间</van-col>
            <van-col span="17" class="vancolinfostyle">{{item.projectStartDateTime}}</van-col>
          </van-row>
          <van-row style="margin-top:10px;">
            <van-col span="7" class="vancoltinfotitlestyle">业务负责人</van-col>
            <van-col span="17" class="vancolinfostyle">{{item.projectBusiness}}</van-col>
          </van-row>
          <van-row style="margin-top:10px;">
            <van-col span="7" class="vancoltinfotitlestyle">生产负责人</van-col>
            <van-col span="17" class="vancolinfostyle">{{item.projectProduce}}</van-col>
          </van-row>
          <van-row style="margin-top:10px;">
            <van-col span="7" class="vancoltinfotitlestyle">项目类型</van-col>
            <van-col span="17" class="vancolinfostyle">
              <van-tag plain type="primary" v-for="(item,index) in (item.projectType == null? '': item.projectType).split(',')"
                       :key="index" style="margin-left: 5px;">{{item}}</van-tag>
            </van-col>
          </van-row>
          <van-row style="margin-top:10px;padding-left:25%;" class="itemprojectInfobtnstyle">
            <van-button type="info" @click="addOrUpdateProjectHandle(id = item.id)" v-if="isAuth('project:project:update')">修改</van-button>
            <van-button type="danger" @click="deleteProjectHandle(item)" style="margin-left:5%;">删除</van-button>
          </van-row>
        </div>
      </div>
    </van-dialog>
    <!-- 弹窗, 新增 / 修改  合同-->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 新增 / 修改  项目-->
    <project-add-or-update v-if="projectAddOrUpdateVisible" ref="projectAddOrUpdate" @refreshDataList="getDataList"></project-add-or-update>
  </div>
</template>

<script>
  import Vue from 'vue'
  import AddOrUpdate from './contract-add-or-update'
  import ProjectAddOrUpdate from './project-add-or-update'
  import moment from 'moment'
  import dateModule from '@/components/date-module'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          startDate: '',
          endDate: ''
        },
        downContractUrl: window.SITE_CONFIG['baseUrl'] + '/project/contract/download?contractNo=',  // 合同下载路径接口,
        tokenHeaders: { token: Vue.cookie.get('token') },  // token请求
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        projectAddOrUpdateVisible: false,
        detailContractShow: false, // 合同详情展开
        detailContractItem: ''    // 合同详情
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
    },
    components: {
      AddOrUpdate,
      ProjectAddOrUpdate,
      dateModule
    },
    created () {
      this.pageSize = 25
      this.pageIndex = 1
      this.dataForm.startDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM-DD')
      this.dataForm.endDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1 , 0)).format('YYYY-MM-DD')
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
      getDataList (contractNo = '') {
        this.dataListLoading = true
        this.detailContractShow = false
        this.$http({
          url: this.$http.adornUrl('/project/contract/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order,
            'startDate': this.dataForm.startDate,
            'endDate': this.dataForm.endDate
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalPage
            this.$refs.dataBox.scrollTop = 0
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$notify({ type: 'danger', message: data.msg })
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
      // 新增 / 修改 合同
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 新增 / 修改 项目
      addOrUpdateProjectHandle (id, item) {
        this.projectAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.projectAddOrUpdate.init(id, item)
        })
      },
      // 删除
      deleteHandle (scop) {
        this.$dialog.confirm({
          title: '提示',
          message: '确定对合同编号[' + scop.contractNo + ']进行删除操作?'
        }).then(() => {
          this.deleteContractApi(scop)
        })
      },
      // 删除合同接口
      deleteContractApi (scop) {
        var ids = scop.id ? [scop.id] : this.dataListSelections.map(item => {
          return item.ids
        })
        this.$http({
          url: this.$http.adornUrl('/project/contract/delete'),
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
            this.$notify({ type: 'danger', message: data.msg })
          }
        })
      },
      // 下载合同文件
      downloadFile (item) {
        window.location.href = window.SITE_CONFIG['uploadUrl'] + 'contract/' + item.filename
      },
      // 删除项目将项目放入回收站
      deleteProjectHandle (item) {
        this.$dialog.confirm({
          title: '提示',
          message: '此操作将项目编号为[' + item.projectNo + ']的项目放入回收站, 是否继续?'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/project/project/delete'),
            method: 'post',
            data: this.$http.adornData(item.id, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$notify(
                { type: 'success', message: '操作成功'})
              this.detailContractShow = false
              this.getDataList()
            } else {
              this.$notify({ type: 'danger', message: data.msg })
            }
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
  .footerbtngroup .van-button {
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    border-radius: 2px;
  }
  .vancoltinfotitlestyle {
    text-align: right;
    font-size: 15px;
  }
  .vancolinfostyle {
    text-align: left;
    padding-left: 10px;
    font-size: 15px;
  }
  .van-divider {
    border-color: #1989fa;
    font-size: 16px;
  }
  .itemprojectInfobtnstyle {
    margin-bottom: 3px;
    border-bottom: 1px dashed #3b97d7bf;
    padding: 8px;
  }
  .itemprojectInfobtnstyle .van-button {
    height: 25px;
    line-height: 20px;
  }

  table{border:0;border-collapse:collapse}
  td{border-collapse:collapse}
  .table_row_tr1 {
    width: 27%;
  }
  .table_row_tr2{
    width: 46%;
  }
  .table_row_tr3{
    width: 27%;
  }
  .table_excuse{
    width: 100%;
    text-align: center;
    padding: 5px;
    color: #6f7180;
    line-height: 300%;
    border: 1px solid #1989faaf;
  }
  .table_detail_info {
    min-height:320px;
    max-height:550px;
    margin:0 auto;
    border-bottom:1px dashed #000;
    overflow:scroll;
  }
  .os {
    overflow: scroll;
  }
  .pm5b {
    padding-top: 10px;
    padding-bottom: 10px;
    margin-top: 10px;
    background: #faf7f7;
  }
  .tac{
    text-align:center;
  }
</style>
