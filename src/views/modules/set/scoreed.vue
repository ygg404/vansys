<template>
  <div class="scoreed_table">
    <div class="addScore">
      <van-button type="info" size="small" @click="addOrUpdateHandle()">新增学历分项</van-button>
    </div>
    <div>
      <table class="scoreeddataTabble" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:10px;">
        <thead>
        <tr class="header">
          <th colspan="3">学制系数</th>
        </tr>
        </thead>
        <tr class="field"><td>对应项</td><td>分数</td><td>操作</td>
        </tr>
          <tr v-for="(item,id) in edList" :key="item.id" class="content" v-if="item.cateid == 1">
            <td class="hl35">{{item.scoreName}}</td>
            <td class="hl35">{{item.score}}</td>
            <td width="150">
              <div class="tabopa">
                <van-button @click="addOrUpdateHandle(item.id)" size="small" type="info">修改</van-button>
                <van-button @click="deleteHandle(item)" size="small" type="danger">删除</van-button>
              </div>
            </td>
          </tr>
      </table>
      <table class="scoreeddataTabble" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:10px;">
        <thead>
        <tr class="header">
          <th colspan="3">专业系数</th>
        </tr>
        </thead>
        <tr class="field"><td>对应项</td><td>分数</td><td>操作</td>
        </tr>
          <tr v-for="(item,id) in edList" :key="id" class="content" v-if="item.cateid == 2">
            <td class="hl35">{{item.scoreName}}</td>
            <td class="hl35">{{item.score}}</td>
            <td width="150">
              <div class="tabopa">
                <van-button @click="addOrUpdateHandle(item.id)" size="small" type="info">修改</van-button>
                <van-button @click="deleteHandle(item)" size="small" type="danger">删除</van-button>
              </div>
            </td>
          </tr>
      </table>
      <table class="scoreeddataTabble" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:10px;">
        <thead>
        <tr class="header">
          <th colspan="3">学历系数</th>
        </tr>
        </thead>
        <tr class="field"><td>对应项</td><td>分数</td><td>操作</td>
        </tr>
          <tr v-for="(item,id) in edList" :key="item.id" class="content" v-if="item.cateid == 3">
            <td class="hl35">{{item.scoreName}}</td>
            <td class="hl35">{{item.score}}</td>
            <td width="150">
              <div class="tabopa">
                <van-button @click="addOrUpdateHandle(item.id)" size="small" type="info">修改</van-button>
                <van-button @click="deleteHandle(item)" size="small" type="danger">删除</van-button>
              </div>
            </td>
          </tr>
      </table>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import AddOrUpdate from './scoreed-add-or-update'
  export default {
    data () {
      return {
        edList: [],   // 学历分对照表
        scoreedVisible: false,
        dragItem: {},  // 拖拽的行
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
          url: this.$http.adornUrl('/set/scoreed/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.edList = data.list
          } else {
            this.edList = []
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
          tip: '提示',
          message: `确定对选项 [${item.scoreName}] 进行[${ids ? '删除' : '批量删除'}]操作?`,
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/set/scoreed/delete'),
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
        for (let dat of this.edList) {
          if (dat.cateid === this.dragItem.cateid) {
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
        }
        console.log('拖动前的索引 :' + preItem.orderNum)
        console.log('拖动后的索引 :' + nextItem.orderNum)
        this.$http({
          url: this.$http.adornUrl('/set/scoreed/changeSort'),
          method: 'get',
          params: this.$http.adornParams({
            preOrderNum: preItem.orderNum,
            nextOrderNum: nextItem.orderNum,
            cateid: preItem.cateid
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
    padding: 5px;
  }

 .scoreed_table table tr th,.scoreed_table table tr td{
    border: 1px solid #ccc;
  }
 .scoreed_table table{
   border-collapse: collapse;
 }
  .hl35{
    height:35px;
    line-height: 35px;
  }
  .scoreeddataTabble{
    width: 320px;
  }

  .scoreeddataTabble .header{
    color: white;
    background: #169fe6;
    width: 100%;
    font-weight: 700;
    font-size: 16px;
    line-height: 200%;

  }
  .scoreeddataTabble .field{
    font-size: 14px;
    text-align: center;
    /*padding: 5px;*/
    line-height: 150%;
    font-weight: 700;
  }
  .scoreeddataTabble .content{
    font-size: 13px;
    text-align: center;
    cursor: Move;
    line-height: 150%;
  }
  .scoreeddataTabble .content .tabopa{
    /*padding: 3px;*/
  }
</style>
