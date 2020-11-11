<template>
  <div>
    <date-module v-model="dataForm" @change="pageIndex=1,getDataList()"></date-module>
    <van-row type="flex" justify="space-between" align="bottom" style="margin-bottom:5px; padding:4px 0px;">
      <van-col span="1" />
      <van-col span="15">
        <van-search class="searchCon" v-model="dataForm.key" @input="pageIndex=1,getDataList()"
                    @cancel="pageIndex=1,dataForm.key = '' " show-action placeholder="搜索关键词..."/>
      </van-col>
      <van-col span="8" class="addcontract">
      </van-col>
    </van-row>
    <el-table :data="dataList" border v-loading="dataListLoading" @sort-change="changeSort" style="width: 100%;">
      <el-table-column prop="projectNo" header-align="center" align="center" label="项目编号" width="120"
                       sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column prop="projectName" header-align="center" align="center" label="项目名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="projectAuthorize" header-align="center" align="center" label="委托单位" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="userName" header-align="center" align="center" label="联系人" width="120"></el-table-column>
      <el-table-column prop="userPhone" header-align="center" align="center" label="联系电话" width="150"></el-table-column>
      <el-table-column prop="projectStartDateTime" header-align="center" align="center" label="项目启动时间"
                       width="130" sortable="custom" :sort-orders="['descending','ascending']"></el-table-column>
      <el-table-column  header-align="center" align="center" width="130" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)" icon="el-icon-edit">签名</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[25, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, prev, pager, next">
    </el-pagination>

  </div>
</template>

<script>
  import moment from 'moment'
  import dateModule from '@/components/date-module'
  import {stringIsNull} from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          sidx: 'id',
          order: 'desc',
          projectType: '',
          startDate: '',
          endDate: ''
        },
        pickerOptionsStart: {},
        pickerOptionsEnd: {},
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        dataList: []
      }
    },
    created () {
      this.dataForm.startDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).format('YYYY-MM-DD')
      this.dataForm.endDate = moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1 , 0)).format('YYYY-MM-DD')
      this.getDataList()
    },
    components: {
      dateModule
    },
    methods: {
      getDataList () {
        let startDate = ''
        let endDate = ''
        if (this.dataForm.startDate != null) startDate = moment(new Date(this.dataForm.startDate)).format('YYYY-MM-DD')
        if (this.dataForm.endDate != null) endDate = moment(new Date(this.dataForm.endDate)).format('YYYY-MM-DD')
        this.dataListLoading = true
        // if (!stringIsNull(this.argsPageIndex)) {
        //   this.pageIndex = this.argsPageIndex
        // }
        // if (!stringIsNull(this.argsPageSize)) {
        //   this.pageSize = this.argsPageSize
        // }
        this.$http({
          url: this.$http.adornUrl('/dop/archives/page'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order,
            'startDate': startDate,
            'endDate': endDate
          })
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 改变开始时间
      changeStart () {
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          disabledDate: (time) => {
            return time.getTime() > this.dataForm.endDate
          }
        })
        this.pageIndex = 1
        this.getDataList()
      },
      // 改变结束时间
      changeEnd () {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate: (time) => {
            return time.getTime() < this.dataForm.startDate
          }
        })
        this.pageIndex = 1
        this.getDataList()
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
        if (val.prop === 'projectNo') {
          this.dataForm.sidx = 'id'
        } else {
          this.dataForm.sidx = val.prop
        }
        this.getDataList()
      },
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

</style>
