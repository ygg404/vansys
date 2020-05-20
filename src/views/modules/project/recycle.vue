<template>
  <div class="mod_card">
    <date-module v-model="dataForm" @change="pageIndex=1,getDataList()"></date-module>
    <van-row type="flex" justify="space-between" align="bottom" style="margin-bottom:5px; padding:4px 0px;">
      <van-col span="1" />
      <van-col span="15">
        <van-search class="searchCon" v-model="dataForm.key" @input="pageIndex=1,getDataList()"
                    @cancel="pageIndex=1,dataForm.key = '' " show-action placeholder="搜索关键词..."/>
      </van-col>
      <van-col span="8" class="addcontract"></van-col>
    </van-row>
    <!-- 表格内容 -->
    <van-row class="table_header">
      <van-col span="6" style="text-align:center;">项目编号</van-col>
      <van-col span="12" style="text-align:center;">项目名称</van-col>
      <van-col span="6" style="text-align:center;">操作</van-col>
    </van-row>
    <div ref="dataBox" :style="'max-height: ' + (documentClientHeight - 250).toString() + 'px'" class="table_van_div">
      <table border="1" class="table_van" >
        <tbody v-loading="dataListLoading" >
          <tr v-for="(item,index) in dataList">
            <td class="table_row_tr1">{{item.projectNo}}</td>
            <td>{{item.projectName}}</td>
            <td class="table_row_tr3" >
              <van-button type="info" size="small" @click="showDetailHandle(item)" round>详情</van-button>
              <van-button type="primary" size="small" @click="restoreHandle(item)" round>恢复项目</van-button>
              <van-button type="danger" size="small" @click="deleteHandle(item.projectNo)" round>删除</van-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <van-pagination class="table_row_pagin" @change="getDataList()"
      v-model="pageIndex"
      :page-count="totalPage"
      mode="simple"
    />

    <!-- 项目详情弹窗-->
    <van-popup v-model="detailShow" closeable round position="bottom" :style="{ height: '50%' }" class="table_detail">
      <van-row class="header_span"><span>项目详情</span></van-row>
      <van-row><van-col span="8">项目编号:</van-col><van-col span="14" offset="2"></van-col>{{detailItem.projectNo}}</van-row>
      <van-row><van-col span="8">项目名称:</van-col><van-col span="14" offset="2"></van-col>{{detailItem.projectName}}</van-row>
      <van-row><van-col span="8">所属合同的编号:</van-col><van-col span="14" offset="2"></van-col>{{detailItem.contractNo}}</van-row>
      <van-row><van-col span="8">项目负责人:</van-col><van-col span="14" offset="2"></van-col>{{detailItem.projectCharge}}</van-row>
      <van-row><van-col span="8">委托单位:</van-col><van-col span="14" offset="2"></van-col>{{detailItem.contractAuthorize}}</van-row>
      <van-row>
        <van-col span="8">项目启动时间:</van-col>
        <van-col span="14" offset="2">{{detailItem.projectStartDateTime != null?detailItem.projectStartDateTime.replace('00:00:00',''):detailItem.projectStartDateTime}}</van-col>
      </van-row>
    </van-popup>
  </div>
</template>

<script>
  import moment from 'moment'
  import dateModule from '@/components/date-module'

  export default {
    data () {
      return {
        detailShow: false,
        detailItem: {},
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          startDate: moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1) ).format('YYYY-MM-DD'),
          endDate: moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1 , 0)).format('YYYY-MM-DD')
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      dateModule
    },
    created () {
      this.getDataList()
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
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
      // 开始时间改变
      changeStart () {
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          disabledDate: (time) => {
            return time.getTime() > this.dataForm.endDate
          }
        })
        this.pageIndex = 1
        this.getDataList()
      },
      // 结束时间改变
      changeEnd () {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate: (time) => {
            return time.getTime() < this.dataForm.startDate
          }
        })
        this.pageIndex = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/project/recycle/list'),
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
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.$refs.dataBox.scrollTop = 0
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
      // 根据项目编号删除
      deleteHandle (projectNo) {
        let tip = '此操作将永久删除编号为[' + projectNo + ']的项目信息, 是否继续?'
        this.$dialog.confirm({
          title: '提示',
          message: tip
        }).then(() => {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/project/recycle/delete'),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$notify({ type: 'success', message: '操作成功' })
              this.getDataList()
            } else {
              this.$notify({ type: 'danger', message: data.msg })
            }
          })
        }).catch(() => {})
      },
      // 恢复项目
      restoreHandle (row) {
        let tip = '是否将恢复编号为[' + row.projectNo + ']的项目信息?'
        this.$dialog.confirm({
          title: '提示',
          message: tip
        }).then(() => {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/project/recycle/update'),
            method: 'post',
            data: {
              'id': row.id,
              'projectNo': row.projectNo
            }
          }).then(({data}) => {
            this.dataListLoading = false
            if (data && data.code === 0) {
              this.$notify({type: 'success', message: '操作成功'})
              this.getDataList()
            } else {
              this.$notify({type: 'danger', message: data.msg})
            }
          })
        })
      },
      // 项目详情
      showDetailHandle (item) {
        this.detailShow = true
        this.detailItem = item
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

  .table_header{
    font-size: 12pt;
    font-weight: 700;
    color: white;
    background: #1989fa;
    width:100%;
    margin-top:2px;
    padding: 5px;
  }
  table{border:0;border-collapse:collapse}
  td{border:1px solid #1989faaf;}
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
</style>
