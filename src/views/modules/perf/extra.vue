<template>
  <div v-loading="dataListLoading">
    <el-form :inline="true" :model="dataForm" style="display:flex;justify-content: space-between;">
      <div class="w95">
        <el-form-item>
          <span class="time_title">考核时间:</span>
          <el-date-picker v-model="dataForm.curTime" type="month" placeholder="选择年月" @change="init"></el-date-picker>
        </el-form-item>
      </div>
    </el-form>

    <div class="w95">
      <div class="estra_title">{{dataForm.curTime.getFullYear() + '年' + (dataForm.curTime.getMonth() + 1) + '月加减分'}}
      </div>
      <div :style="'max-height: ' + (documentClientHeight - 270).toString() + 'px'">

        <el-table :data="userBranchList" border @cell-click="extraColClickHandle"
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}" :span-method="objectSpanMethod">
          <el-table-column label="部门" prop="branchName"></el-table-column>
          <el-table-column label="用户名" prop="userName"></el-table-column>
          <el-table-column label="个人加减分" prop="extraScore">
            <template slot-scope="scope">
              <span>{{ scope.row.extraScore + 10 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最终加减分" prop="finalScore"></el-table-column>
          <el-table-column label="加减分编辑">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editExtraHandle(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <van-dialog v-model="infoShow" :closeOnClickOverlay="infoShow" confirm-button-text="返回">
      <template slot="title">
        <div style="margin-bottom:10px;text-align:center;font-size:16px;font-weight:600;">个人加减分明细
          <span v-if="extraScoreItem.userName !== undefined" style="padding: 10px;font-size: 12pt;color: #3b97d7">
                  {{'(' + extraScoreItem.userName + ')'}}</span>
        </div>
      </template>
      <!-- <div style="overflow-y: auto;max-height: 450px;">
      <el-table :data="extraScoreItem.extraScoreList" border :span-method="objectSpanMethod" show-summary>
      <el-table-column prop="extraType" label="类型" width="40">
      <template slot-scope="scope">
      <div v-if="scope.row.extraType == 0">加分项</div>
      <div v-if="scope.row.extraType == 1">减分项</div>
      </template>
      </el-table-column>
      <el-table-column prop="extraItem" label="加减分项"></el-table-column>
      <el-table-column prop="standard" label="计分标准"></el-table-column>
      <el-table-column prop="extraNum" label="分数" width="80"></el-table-column>
      </el-table>
      </div> -->
      <div style="overflow-y: auto;max-height: 500px;">
        <el-table :data="extraScoreItem.extraScoreList" border :span-method="objectSpanMethod" show-summary>
          <el-table-column prop="extraType" label="类型" width="40">
            <template slot-scope="scope">
              <div v-if="scope.row.extraType == 0">加分项</div>
              <div v-if="scope.row.extraType == 1">减分项</div>
            </template>
          </el-table-column>
          <el-table-column prop="extraItem" label="加减分项"></el-table-column>
          <el-table-column prop="standard" label="计分标准"></el-table-column>
          <el-table-column prop="extraNum" label="分数" width="80"></el-table-column>
        </el-table>
      </div>
    </van-dialog>


    <!-- 个人加减分 编辑 弹出窗口-->
    <add-or-update ref="extraAddOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="init"></add-or-update>
  </div>
</template>

<script>
  import {getYearItem, getRateItem} from '@/utils/selectedItem'
  import {treeDataTranslate, stringIsNull} from '@/utils'
  import addOrUpdate from './extra-add-or-update'

  export default {
    data() {
      return {
        infoShow: false,
        dataForm: {
          key: '',
          curTime: new Date()
        },
        yearItemList: getYearItem(),
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        userBranchList: [],
        extraList: [],  // 加减分项列表
        extraScoreItem: {
          extraScoreList: []
        }  // 显示的个人加减分明细
      }
    },
    components: {
      addOrUpdate
    },
    computed: {
      documentClientHeight: {
        get() {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          if (row.isFirst || rowIndex === 0) {
            return {
              rowspan: row.size,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      init() {
        this.dataListLoading = true
        this.extraScoreItem = {
          extraScoreList: []
        }
        this.getExtralist().then(extraList => {
          this.getExtraScorelist().then(scoreList => {
            this.getUserList().then(userList => {
              this.getBranchList().then(branchList => {
                this.userBranchList = this.userBranchInit(branchList, userList, extraList, scoreList)
                console.log(this.userBranchList)
                this.dataListLoading = false
              })
            })
          })
          // this.extraList = extraList
        })
      },
      // 获取所有部门
      getBranchList() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/branch/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            }
          })
        })
      },
      // 获取所有子部门
      getBranchChildList(branchlist) {
        let childList = []
        for (let branch of branchlist) {
          if (branch.children !== undefined) {
            childList = childList.concat(this.getBranchChildList(branch.children))
          } else {
            childList.push(branch)
          }
        }
        return childList
      },
      // 获取各个岗位的所有用户
      getUserList() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extra/userList'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.userList)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      },
      // 列表初始化
      userBranchInit(branchList, userList, extraList, scoreList) {
        let userBranchList = []
        let branchChildList = this.getBranchChildList(treeDataTranslate(branchList))
        for (let branch of branchChildList) {
          branch.recordVoList.map(record => {
            let userItem = userList.find(user => user.userId === record.userId)
            if (!stringIsNull(userItem) && userBranchList.find(user => user.userId === userItem.userId) === undefined) {
              let uscoreList = []
              let extraScore = 0
              for (let score of scoreList) {
                if (score.checkUserId === userItem.userId) {
                  uscoreList.push(score)
                  extraScore += score.extraNum
                }
              }
              userItem.branchId = branch.id
              userItem.branchName = branch.branchName
              userItem.extraScore = extraScore
              userItem.extraScoreList = this.extraScoreInit(extraList, uscoreList)
              userBranchList.push(userItem)
            }
          })
          console.log(userBranchList)
        }
        let brandId = 0
        let sizeList = []
        let maxScorelist = []
        let size = 0
        let maxScore = 0
        for (let uBranch of userBranchList) {
          if (brandId !== uBranch.branchId) {
            uBranch.isFirst = true
            sizeList.push(size)
            maxScorelist.push(maxScore)
            size = 0
            maxScore = 0
            brandId = uBranch.branchId
          } else {
            uBranch.isFirst = false
          }
          size += 1
          // 获取每一队的最高分
          if (uBranch.extraScore + 10 > maxScore) {
            maxScore = uBranch.extraScore + 10
          }
        }
        if (size !== 0) sizeList.push(size)
        if (maxScore !== 0) maxScorelist.push(maxScore)
        // 每人每队设置组内成员的数量和最高分数
        let index = 0
        for (let uBranch of userBranchList) {
          if (uBranch.isFirst) {
            uBranch.size = sizeList[index + 1]
            index += 1
          }
          uBranch.maxScore = maxScorelist[index]
          uBranch.finalScore = parseFloat((uBranch.extraScore + 10) * 9 / uBranch.maxScore).toFixed(2)
        }
        return userBranchList
      },
      // 评分列表初始化
      extraScoreInit(extraList, scoreList) {
        let sizeList = []
        let extrascoreList = []
        let type = -1
        let size = 0
        // 先计算加分项
        for (let extra of extraList) {
          let extraPart = {
            extraId: extra.id,
            extraItem: extra.extraItem,
            standard: extra.standard,
            remark: extra.remark,
            extraType: extra.extraType,
            isFirst: false
          }
          if (extra.extraType !== type) {
            type = extra.extraType
            sizeList.push(size)
            size = 0
            extraPart.isFirst = true
          }
          size += 1
          let score = scoreList.find(scoeItem => scoeItem.extraId === extra.id)
          if (!stringIsNull(score)) {
            extraPart.extraNum = score.extraNum
          } else {
            extraPart.extraNum = 0
          }
          extrascoreList.push(extraPart)
        }
        if (size > 0) sizeList.push(size)
        let index = 0
        for (let extrascore of extrascoreList) {
          if (extrascore.isFirst) extrascore.size = sizeList[++index]
        }
        return extrascoreList
      },
      // 点击查看一行 加减分明细
      extraRowClickHandle(row, event, column) {
        this.extraScoreItem = row
      },
      // 获取加减分项列表
      getExtralist() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extra/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      },
      // 获取加减分项列表
      getExtraScorelist() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extrascoring/list'),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curTime.getFullYear(),
              month: this.dataForm.curTime.getMonth() + 1
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      },
      // 个人加减分编辑
      editExtraHandle(item) {
        item.year = this.dataForm.curTime.getFullYear()
        item.month = this.dataForm.curTime.getMonth() + 1
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.extraAddOrUpdate.init(item)
        })
      },
      extraColClickHandle(row, event, column) {
        if (column.innerText === '编辑') {
          return
        } else {
          this.infoShow = true
          this.extraScoreItem = row
        }
      }
    }
  }
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 2px;
  }

  .estra_title {
    text-align: center;
    font-weight: 600;
    font-size: 17px;
    margin-bottom: 8px;
    border-bottom: 1px dotted black;
    padding-bottom: 2px;
  }

  .w95 {
    width: 95%;
    margin: 10px auto 0;
  }
</style>
