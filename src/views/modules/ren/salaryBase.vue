<template>
  <div>
    <el-form :inline="true" :model="dataForm" style="margin-top:8px;padding-left:5px;">
      <el-form-item label="工资表时间：">
        <el-date-picker v-model="dataForm.payDate"   type="month"  @change="getDataList"
                        placeholder="请选择工资表月份" class="pay_item" ></el-date-picker>
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <div class="bts">{{dataForm.payDate.getFullYear() + '年' + (dataForm.payDate.getMonth() + 1) + '月'}} 基本工资表</div>
    </div>
    <!--数据-->
    <div :style="'max-height: ' + (documentClientHeight - 180).toString() + 'px'" class="salarybase_table_content">
      <el-table border :data="dataList" border v-loading="dataListLoading">
        <el-table-column prop="username" header-align="center" align="center" label="姓名" ></el-table-column>
        <el-table-column prop="fixedSalary" header-align="center" align="center" label="固定工资" >
          <template slot-scope="scope">
            <span style="color: #1989fa">{{scope.row.fixedSalary}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="housingSalary" header-align="center" align="center" label="住房补贴" >
          <template slot-scope="scope">
            <span style="color: #1989fa">{{scope.row.housingSalary}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="kbiFinalScore" header-align="center" align="center" label="效能分" ></el-table-column>
        <el-table-column prop="kbiSalary" header-align="center" align="center" label="效能工资" >
          <template slot-scope="scope">
            <span style="color: #1989fa">{{scope.row.kbiSalary}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="总基本工资">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.fixedSalary + scope.row.housingSalary + scope.row.kbiSalary}}</span>
          </template>
        </el-table-column>
        <el-table-column  header-align="center" align="center" width="110" label="操作" >
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-tickets" type="primary"
                       @click="salaryDetailHandle(scope.row)" >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <salary-base-detail ref="salaryBaseDetail" v-if="detailVisible" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import salaryBaseDetail from './salaryBase-detail'

  export default {
    data () {
      return {
        detailVisible: false,
        dataForm: {
          payDate: '',
          year: '',     // 年份
          updown: ''    // 上下半年(0-上半年，1-下半年 )
        },
        dataListLoading: false,
        dataList: []
      }
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    components: {
      salaryBaseDetail
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        let datenow = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
        this.dataForm.payDate = new Date(datenow.getFullYear(), datenow.getMonth(), 1)
        this.getDataList()
      },
      getDataList () {
        // 由工资时间来获取 考核的年度
        // (1-6月 考核年度为 去年下半年；7-12月 考核年度为 今年上半年)
        console.log(this.dataForm.payDate)
        if (this.dataForm.payDate.getMonth() >= 0 && this.dataForm.payDate.getMonth() < 6) {
          this.dataForm.updown = 1
        } else {
          this.dataForm.updown = 0
        }
        this.dataForm.year = this.dataForm.payDate.getFullYear()
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/ren/salarybase/list`),
          method: 'get',
          params: this.$http.adornParams({
            year: this.dataForm.year,
            updown: this.dataForm.updown,
            salaryYear: this.dataForm.payDate.getFullYear(),
            salaryMonth: this.dataForm.payDate.getMonth() + 1
          })
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === 0) {
            this.dataList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      salaryDetailHandle (item) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.salaryBaseDetail.init(item)
        })
      }
    }
  }
</script>

<style scoped>
.bts{
  font-size:1.17em;font-weight:bold;margin-top:10px;margin-bottom:10px;
}
.el-form-item{
  margin-bottom:0px;
}
.salarybase_table_content{
  width:95%;margin:0 auto;overflow: scroll;
}
</style>
