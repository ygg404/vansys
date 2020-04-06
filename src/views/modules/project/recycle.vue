<template>
  <div class="mod_card">
    <van-row type="flex" justify="space-between" align="bottom" style="border-top: 1px solid rgb(195, 197, 199); border-bottom: 1px solid rgb(195, 197, 199);">
      <van-col span="12" >
        <van-cell   center title="开始日期"  :value="startDatedata" @click="startDateshow = true" />
        <van-calendar v-model="startDateshow" @confirm="startDateConfirm"  :default-date="nowStartDate" :min-date="minStartDate" :max-date="maxStartDate" color="#1989fa"/>
      </van-col>
      <van-col span="12">
        <van-cell  center  title="结束日期"  :value="endDatedata" @click="endDateshow = true" />
        <van-calendar v-model="endDateshow" @confirm="endDateConfirm" :default-date="nowEndDate" :min-date="minEndDate" :max-date="maxEndDate" color="#1989fa"/>
      </van-col>
    </van-row>

    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item style="margin-left: 20px;">
        <el-date-picker v-model="dataForm.startDate" type="date"  placeholder="开始日期" style="width: 150px;" :picker-options="pickerOptionsStart" @change="changeEnd"></el-date-picker> 至
        <el-date-picker v-model="dataForm.endDate" type="date"  placeholder="结束日期" style="width: 150px;" :picker-options="pickerOptionsEnd" @change="changeStart"></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left: 20px;">
        <el-input v-model="dataForm.key" placeholder="关键字搜索" clearable @change="getDataList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
<!--    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" @sort-change="changeSort" style="width: 100%;">-->
<!--      <el-table-column prop="projectNo" header-align="center" align="center" width="120" label="项目编号" sortable="custom" :sort-orders="['descending','ascending','descending']"></el-table-column>-->
<!--      &lt;!&ndash;<el-table-column prop="contractNo" header-align="center" align="center" width="120" label="合同编号" ></el-table-column>&ndash;&gt;-->
<!--      <el-table-column prop="projectName" header-align="center" align="left" label="项目名称" :show-overflow-tooltip="true"></el-table-column>-->
<!--      <el-table-column prop="projectCharge" header-align="center" align="center" label="项目负责人" :show-overflow-tooltip="true" width="100"></el-table-column>-->
<!--      <el-table-column prop="projectAuthorize" header-align="center" align="center" label="委托单位" :show-overflow-tooltip="true"></el-table-column>-->
<!--      <el-table-column prop="projectStartDateTime" header-align="center" align="center" label="项目启动时间" :show-overflow-tooltip="true">-->
<!--        <template slot-scope="scope">{{scope.row.projectStartDateTime != null? scope.row.projectStartDateTime.substring(0,10) : ''}}</template>-->
<!--      </el-table-column>-->
<!--      &lt;!&ndash;<el-table-column prop="projectStageName" header-align="center" align="center" label="项目阶段" :show-overflow-tooltip="true"></el-table-column>&ndash;&gt;-->
<!--      <el-table-column header-align="center" align="left" width="190" label="操作" style="z-index: -1">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" size="mini" @click="restoreHandle(scope.row)">恢复项目</el-button>-->
<!--          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.projectNo)">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <el-pagination-->
<!--      @size-change="sizeChangeHandle"-->
<!--      @current-change="currentChangeHandle"-->
<!--      :current-page="pageIndex"-->
<!--      :page-sizes="[25, 50, 100]"-->
<!--      :page-size="pageSize"-->
<!--      :total="totalPage"-->
<!--      layout="total, sizes, prev, pager, next, jumper">-->
<!--    </el-pagination>-->
    <div :style="'max-height: ' + (documentClientHeight - 225).toString() + 'px'" class="table_van_div">
      <table border="1" class="table_van" >
        <thead class="table_row_title" >
          <tr ><th class="table-th-css">项目编号</th><th class="table-th-css">项目名称</th><th class="table-th-css">操作</th></tr>
        </thead>
        <tbody v-loading="dataListLoading" >
          <tr v-for="(item,index) in dataList">
            <td class="table_row_tr1">{{item.projectNo}}</td>
            <td>{{item.projectName}}</td>
            <td class="table_row_tr3" >
              <van-button type="info" size="small" @click="showDetailHandle(item)">详情</van-button>
              <van-button type="primary" size="small" @click="restoreHandle(item)">恢复项目</van-button>
              <van-button type="danger" size="small" @click="deleteHandle(item.projectNo)">删除</van-button>
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
          startDate: '',
          endDate: ''
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
  .table-th-css {
    position: relative !important;
    text-align: center;
    top: 0;
  }
</style>
