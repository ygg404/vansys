<template>
  <div class="scorehouse_table">
    <div class="addScore">
      <van-button type="info" size="small" @click="addOrUpdateHandle()">新增</van-button>
    </div>
    <div style="overflow-y:scroll;">
      <table class="dataTabble" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:10px;height:500px;">
        <thead>
        <tr class="header">
          <th colspan="5">职级认定及其房补对照表</th>
        </tr>
        </thead>
        <tr class="field">
          <td>分数下限(>=)</td><td>分数上限(<)</td><td>职级</td><td>房补</td><td>操作</td>
        </tr>
        <draggable v-model="dataList" element="tbody" :move="getdata" @update="datadragEnd">
          <tr v-for="(item,id) in dataList" :key="item.id" class="content">
            <td class="hl35">{{item.lowScore}}</td>
            <td class="hl35">{{item.highScore}}</td>
            <td class="hl35">{{item.jobRank}}</td>
            <td class="hl35">{{item.houseAdd}}</td>
            <td width="80">
              <div style="padding-top:2px;padding-bottom:3px;">
                <van-button @click="addOrUpdateHandle(item.id)" size="mini" type="info">修改</van-button>
              </div>
              <div style="padding-bottom:2px;">
                <van-button @click="deleteHandle(item)" size="mini" type="danger">删除</van-button>
              </div>
            </td>
          </tr>
        </draggable>
      </table>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import AddOrUpdate from './scorehouse-add-or-update'
  export default {
    data () {
      return {
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      draggable,
      AddOrUpdate
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/set/scorehouse/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.list
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
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
      deleteHandle (item) {
        var ids = item.id ? [item.id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$dialog.confirm({
          title: '提示',
          message: `确定对选项 [${item.jobRank}] 进行[${ids ? '删除' : '批量删除'}]操作?`
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/set/scorehouse/delete'),
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
      // 拖动中与拖动结束
      getdata (evt) {
        this.dragItem = evt.draggedContext.element
      },
      datadragEnd (evt) {
        let preItem = this.dragItem
        let nextItem = this.dragItem
        let index = -1
        for (let dat of this.dataList) {
          index += 1
          // 顺序上升
          if (evt.newIndex < evt.oldIndex && evt.newIndex + 1 === index) {
            nextItem = dat
          }
          // 顺序下降
          if (evt.newIndex > evt.oldIndex && evt.newIndex - 1 === index) {
            nextItem = dat
          }
        }
        this.$http({
          url: this.$http.adornUrl('/set/scorehouse/changeSort'),
          method: 'get',
          params: this.$http.adornParams({
            preOrderNum: preItem.orderNum,
            nextOrderNum: nextItem.orderNum
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '改变顺序成功',
              type: 'success',
              duration: 1500
            })
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .addScore {
    padding: 10px;
  }
  .scorehouse_table table tr th,.scorehouse_table table tr td{
    border: 1px solid #ccc;
  }
  .scorehouse_table table{
    border-collapse: collapse;
  }
  .hl35{
    height:35px;
    line-height: 35px;
  }
  .dataTabble{
    width: 100%;
  }

  .dataTabble .header{
    color: white;
    background: #169fe6;
    width: 100%;
    font-weight: 700;
    font-size: 16pt;
    line-height: 200%;

  }
  .dataTabble .field{
    font-size: 13px;
    text-align: center;
    padding: 5px;
    line-height: 150%;
    font-weight: 600;
  }
  .dataTabble .content{
    font-size: 10pt;
    text-align: center;
    cursor: Move;
    line-height: 150%;
  }

</style>
