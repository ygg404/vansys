<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" style="margin-top: 4px;margin-left:20px;">
      <el-form-item >
        <el-input v-model="dataForm.key" placeholder="用户名／用户操作" @change="getDataListbefore()" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="pageIndex=1,getDataListbefore()" >查询</el-button>
      </el-form-item>
    </el-form>
    <div ref="dataBox" :style="'max-height: ' + (documentClientHeight - 220).toString() + 'px'" class="os">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%">
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="username"
          header-align="center"
          align="center"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="operation"
          header-align="center"
          align="center"
          label="用户操作">
        </el-table-column>
        <el-table-column
          prop="method"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
          label="请求方法">
        </el-table-column>
        <el-table-column
          prop="params"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
          label="请求参数">
        </el-table-column>
        <el-table-column
          prop="time"
          header-align="center"
          align="center"
          label="执行时长(毫秒)">
        </el-table-column>
        <el-table-column
          prop="ip"
          header-align="center"
          align="center"
          width="150"
          label="IP地址">
        </el-table-column>
        <el-table-column
          prop="device"
          header-align="center"
          align="center"
          width="150"
          label="请求端">
        </el-table-column>
        <el-table-column
          prop="createDate"
          header-align="center"
          align="center"
          width="180"
          label="创建时间">
        </el-table-column>
      </el-table>
    </div>
    <!--分页控件-->
    <van-pagination v-model="pageIndex" items-per-page = "25" :total-items="totalPage" mode="simple" @change="getDataList()" />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          operation: '',
          params: '',
          order: 'desc'
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: []
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/log/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'operation': this.dataForm.operation,
            'params': this.dataForm.params,
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
      }
    }
  }
</script>
<style>
  .os {
    overflow: scroll;
  }
</style>
