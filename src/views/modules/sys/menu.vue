<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm" style="margin-top: 5px;">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <div ref="dataBox" :style="'max-height: ' + (documentClientHeight - 150).toString() + 'px'" class="table_van_div">
      <el-table
        :data="dataList"
        v-loading="dataListLoading"
        border
        style="width: 100%;">
        <el-table-column prop="menuId" header-align="center" align="center" width="80" label="ID"></el-table-column>
        <table-tree-column prop="name" header-align="center" treeKey="menuId" width="170" label="名称" ></table-tree-column>
        <el-table-column prop="parentName" header-align="center" align="center" width="120" label="上级菜单"></el-table-column>
        <el-table-column header-align="center" align="center" label="图标" width="80">
          <template slot-scope="scope">
            <icon-svg :name="scope.row.icon || ''"></icon-svg>
          </template>
        </el-table-column>
        <el-table-column prop="type" header-align="center" align="center" label="类型" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
            <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
            <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" header-align="center" align="center" label="排序号" width="80"></el-table-column>
        <el-table-column prop="isValid" header-align="center" align="center" label="是否有效" width="80">
          <template slot-scope="scope"><el-switch v-model="scope.row.validFlag" @change="validSwitchHandle(scope.row)"></el-switch></template>
        </el-table-column>
        <el-table-column prop="url" header-align="center" align="center" :show-overflow-tooltip="true" label="菜单URL"></el-table-column>
        <el-table-column prop="perms" header-align="center" align="center"  :show-overflow-tooltip="true" label="授权标识"></el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('sys:menu:update')" type="primary" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
            <el-button v-if="isAuth('sys:menu:delete')" type="danger" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './menu-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    created () {
      this.getDataList()
    },
    mounted () {
      this.expandAll()
    },
    methods: {
      // 默认展开
      expandAll () {
        console.log(this.$el.getElementsByClassName('el-icon-caret-right'))
        const els = this.$el.getElementsByClassName('el-icon-caret-right')
        for (let i = 0; i < els.length; i++) {
          els[i].click()
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        let that = this
        return new Promise(function (resolve, reject) {
          that.$http({
            url: that.$http.adornUrl('/sys/menu/list'),
            method: 'get',
            params: that.$http.adornParams()
          }).then(({data}) => {
            that.dataList = treeDataTranslate(data, 'menuId')
            that.dataListLoading = false
            // that.expandAll()
          })
        })
      },
      // 修改菜单有效标志位
      validSwitchHandle (item) {
        this.$http({
              url: this.$http.adornUrl('/sys/menu/update'),
              method: 'post',
              data: this.$http.adornData({
                'menuId': item.menuId,
                'type': item.type,
                'name': item.name,
                'parentId': item.parentId,
                'url': item.url,
                'perms': item.perms,
                'orderNum': item.orderNum,
                'validFlag': item.validFlag
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
              }
          })
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
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
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
        }).catch(() => {})
      }
    }
  }
</script>
