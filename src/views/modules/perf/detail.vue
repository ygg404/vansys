<template>
  <div v-loading="dataLoading">
    <el-form :inline="true" :model="dataForm" style="display:flex;justify-content: space-between;">
      <div class="w95">
        <el-form-item>
          <span style="font-size:15px;">考核时间:</span>
          <el-date-picker v-model="dataForm.curTime" type="month" placeholder="选择年月" @change="init"></el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <div style="width: 95%;margin: 5px auto 10px;">
      <van-row type="flex" align="center" style="padding-bottom:5px;border-bottom:1px dotted black;">
        <van-col span="24">
          <div class="f17dt tac">
            {{dataForm.curTime.getFullYear() + '年' + (dataForm.curTime.getMonth() + 1) + '月 效能考核明细'}}
          </div>
        </van-col>
      </van-row>
      <!---->
      <!--标题-->
      <van-row class="data_title">
        <van-col span="4" class="tar">被考核人</van-col>
        <van-col span="5" class="tac">效能评价分</van-col>
        <van-col span="4" class="tac">加减得分</van-col>
        <van-col span="5" class="tac">效能基准分</van-col>
        <van-col span="6">最终效能得分</van-col>
      </van-row>
      <!--数据-->
      <div :style="'max-height: ' + (documentClientHeight - 220).toString() + 'px'" class="os">
        <div v-for="(checkUser,indexA) in checkUserList">
          <van-collapse v-model="activeName" class="detailcoll" :key="indexA">
            <van-collapse-item :name="checkUser.checkUserId" :is-link="isAuth('perf:assess:detial')" border>
              <template slot="title">
                <van-row style="color: #3b97d7">
                  <van-col span="5">{{checkUser.checkUserName}}</van-col>
                  <van-col span="5">{{checkUser.kbiAllScore}}</van-col>
                  <van-col span="5">{{checkUser.finalExtra}}</van-col>
                  <van-col span="5">{{checkUser.standardScore}}</van-col>
                  <van-col span="4">{{getFinalKbiScore(checkUser)}}</van-col>
                </van-row>
              </template>
              <van-collapse v-model="activeKbi" class="detailcoll" v-if="isAuth('perf:assess:detial')">
                <van-collapse-item name="1">
                  <template slot="title">
                    <div class="coll_title">效能评分表</div>
                  </template>
                  <div style="overflow-x: auto; max-height:300px;">
                    <table class="bs" border="1" cellspacing="0">
                      <thead>
                      <tr>
                        <td v-for="(kbiItem,indexB) in checkUser.kbiItemList" v-if="kbiItem.kbiRatio != 0"
                            class="tac detail_td_style" style="min-width:150px;">
                          {{kbiItem.kbiName}} {{kbiItem.kbiRatio}}%
                        </td>
                        <td style="min-width:90px;" class="detail_td_style">个人效能评分</td>
                        <td style="min-width:90px;" class="detail_td_style">是否其领导</td>
                        <td style="min-width:110px;" class="detail_td_style">是否为同一部门</td>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(kbi,indexB) in checkUser.kbiList">
                        <td v-for="(kbiItem,indexB) in checkUser.kbiItemList" v-if="kbiItem.kbiRatio != 0">
                          <table-solt :List="kbi" :num="kbiItem.kbiId">
                            <template slot-scope="slotProps">
                              <div class="tac f14cb">
                                {{slotProps.itemValue}}
                              </div>
                            </template>
                          </table-solt>
                        </td>
                        <td class="tac" style="color:red;">
                          {{kbi.everyAllScore}}
                        </td>
                        <td class="tac">
                          <van-tag type="primary" v-if="kbi.isGuider">是</van-tag>
                          <van-tag v-else>否</van-tag>
                        </td>
                        <td class="tac">
                          <van-tag type="primary" v-if="kbi.isSameBranch">是</van-tag>
                          <van-tag v-else>否</van-tag>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </van-collapse-item>
              </van-collapse>
              <van-collapse v-model="activePlus" class="detailcoll" v-if="isAuth('perf:assess:detial')">
                <van-collapse-item name="1">
                  <template slot="title">
                    <div class="coll_title">加减分评分表</div>
                  </template>
                  <div style="overflow-x: auto;max-height:300px;">
                    <table class="bs" border="1" cellspacing="0" cellpadding="0">
                      <thead>
                      <tr class="score_title">
                        <td class="tac detail_td_style">类型</td>
                        <td class="tac detail_td_style">加减分项</td>
                        <td class="tac detail_td_style">计分标准</td>
                        <td class="tac detail_td_style">分数</td>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(score,indexB) in checkUser.scoreList" class="detail_score_style">
                        <td class="tac" style="min-width:70px;" v-if="score.isFirst"
                            :rowspan="score.isFirst?score.size:1" colspan="1">
                          <div v-if="score.extraType == 0 && score.isFirst" class="f14cb">加分项</div>
                          <div v-if="score.extraType == 1 && score.isFirst" class="f14cb">减分项</div>
                        </td>
                        <td class="f14cb" style="min-width:250px;">{{score.extraItem}}</td>
                        <td class="f14cb" style="min-width:150px;">{{score.standard}}</td>
                        <td class="tac f14cb" style="min-width:90px;">{{score.extraNum}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </van-collapse-item>
              </van-collapse>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>

    </div>

    <detailUser ref="detailUser"></detailUser>
  </div>
</template>

<script>
  import {getYearItem, getRateItem} from '@/utils/selectedItem'
  import {treeDataTranslate} from '@/utils'
  import {stringIsNull} from '../../../utils'
  import detailUser from './detail-user'
  import tableSolt from '@/components/table-solt'

  export default {
    data() {
      return {
        activePlus: [],
        activeKbi: [],
        activeName: [],
        dataLoading: false,
        dataForm: {
          curTime: new Date()
        },
        yearItemList: getYearItem(),
        checkUserList: [],
        attendNum: 0,
        branchList: [],   // 部门列表
        branchTree: [],    // 部门树表
        uScoreList: [],    // 评分列表
        branchChildList: []
      }
    },
    computed: {
      documentClientHeight: {
        get() {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    created() {
      this.dataForm.curYear = new Date()
      this.init()
    },
    components: {
      detailUser,
      tableSolt
    },
    methods: {
      init () {
        this.dataLoading = true
        // 获取部门列表
        this.getBranchList().then(branchList => {
          this.getUaccessList().then(uRoleList => {
            this.branchList = branchList
            this.getAccessList().then(list => {
              this.getExtralist().then(extraList => {
                this.getExtraScorelist().then(scoreList => {
                  this.dataLoading = false
                  let checkUserList = this.acceessListInit(list)
                  for (let checkUser of checkUserList) {
                    // 设置每个人的效能基准分
                    checkUser.standardScore = uRoleList.find(item => item.userId === checkUser.checkUserId).standardScore
                    checkUser.scoreList = this.extraScoreInit(checkUser, extraList, scoreList)
                    // 计算每个人的总加减分
                    let allScore = 0
                    for (let score of checkUser.scoreList) {
                      allScore += score.extraNum
                    }
                    checkUser.allScore = allScore
                  }
                  // 设置每成员的部门 并获取部门的最高分
                  checkUserList = this.setBranchScoreFun(checkUserList, branchList)
                  this.checkUserList = this.setKbiScore(checkUserList)
                })
              })
            })
          })
        })
        // this.$refs.detailUser.init(this.dataForm)
      },

      // 获取部门列表
      getBranchList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/branch/list`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取评分列表
      getAccessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/perf/access/list`),
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
              reject(data.msg)
            }
          })
        })
      },
      // 获取已经评分的用户列表
      getUaccessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/perf/access/uAssessList`),
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
              reject(data.msg)
            }
          })
        })
      },
      // 评分表初始化
      acceessListInit (accessList) {
        let checkUserId = 0
        let kbiId = 0
        let userId = 0
        let checkUserList = []
        for (let access of accessList) {
          if (access.checkUserId !== checkUserId) {
            let checkItem = {
              checkUserId: access.checkUserId,
              checkUserName: access.checkUserName,
              kbiAllScore: 0,
              extraScore: 0,
              kbiItemList: [], // 考核项
              kbiList: []
            }
            checkUserList.push(checkItem)
            checkUserId = access.checkUserId
            userId = 0
            kbiId = 0
          }
          // 获取每个人的考核评分项
          if (access.kbiId > kbiId) {
            checkUserList[checkUserList.length - 1].kbiItemList.push({
              kbiId: access.kbiId,
              kbiName: access.kbiName,
              kbiRatio: access.kbiRatio
            })
            kbiId = access.kbiId
          }
          // 评分人明细
          if (access.userId !== userId) {
            let kbiItem = {
              userId: access.userId,
              userName: access.userName,
              isGuider: this.isGuiderHandle(access.userId,access.checkUserId),
              isSameBranch: this.isSameBranch(access.userId,access.checkUserId)
            }
            userId = access.userId
            checkUserList[checkUserList.length - 1].kbiList.push(kbiItem)
          }
          checkUserList[checkUserList.length - 1].kbiList[checkUserList[checkUserList.length - 1].kbiList.length - 1]['kbiId' + access.kbiId] = access.kbiScore
        }
        this.attendNum = checkUserList[checkUserList.length - 1] === undefined ? 0 : checkUserList[checkUserList.length - 1].kbiList.length
        return checkUserList
      },
      // 是否为部门领导
      isGuiderHandle (userId,checkUserId) {
        let isGuider = false
        // 被考核人所在的所有部门
        let inBranchList = []
        this.branchList.map(branch => {
          branch.recordVoList.map(record => {
            if (record.userId === checkUserId) inBranchList.push(branch.id)
          })
        })
        // 获取被考核人所有的父类部门
        let parentList = []
        for (let branchId of inBranchList) {
          parentList.push(branchId)
          this.getParentBranchList(parentList, branchId)
        }
        // 判断考核人是否为被考核人的领导
        for (let branchId of parentList) {
          let branchItem = this.branchList.find(branch => branch.id === branchId)
          if (branchItem.mdeputyId === userId || branchItem.sdeputyId === userId) isGuider = true
        }
        return isGuider
      },
      // 获取部门的父部门
      getParentBranchList (parentList = [] , branchId) {
        this.branchList.map( branch => {
          if (branch.id === branchId && branch.parentId !== 0) {
            parentList.push(branch.parentId)
            this.getParentBranchList(parentList,branch.parentId)
          }
        })
      },
      // 判断 考核人与被考核人 是否为同一个部门
      isSameBranch (userId,checkUserId) {
        let isSame = false
        let userBranchId = []     // 考核人的部门
        let checkBranchId = []    // 被考核人的部门
        this.branchList.map(branch => {
          for (let userItem of branch.recordVoList) {
            if (userId === userItem.userId) userBranchId.push(branch.id)
            if (checkUserId === userItem.userId) checkBranchId.push(branch.id)
          }
        })
        for (let uBranchId of userBranchId) {
          for (let cBranchId of checkBranchId) {
            if (uBranchId === cBranchId) isSame = true
          }
        }
        return isSame
      },
      // 获取加减分项列表
      getExtralist () {
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
      getExtraScorelist () {
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
      // 评分列表初始化
      extraScoreInit (checkUser,extraList,scoreList) {
        let uScoreList = []
        for (let scoreItem of scoreList) {
          if (scoreItem.checkUserId === checkUser.checkUserId) {
            uScoreList.push(scoreItem)
          }
        }
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
          let score = uScoreList.find(scoeItem => scoeItem.extraId === extra.id)
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
      // 计算最终的加减得分
      setBranchScoreFun (checkUserList, branchList) {
        let branchChildList = this.getBranchChildList(treeDataTranslate(branchList))
        for (let checkUser of checkUserList) {
          for (let branch of branchChildList) {
            if (branch.recordVoList.find(record => record.userId === checkUser.checkUserId) !== undefined) {
              checkUser.branchId = branch.id
              checkUser.branchName = branch.branchName
              break
            }
          }
        }
        // 统计每个部门的最高分
        let branchMaxScoreList = []
        for (let checkUser of checkUserList ) {
          let branch = branchMaxScoreList.find(branch => branch.brandId === checkUser.branchId)
          let branchScore = {
            branchId: checkUser.branchId,
            maxScore: checkUser.allScore
          }
          if (branch !== undefined && branch.maxScore < branchScore.maxScore) {
            branch.maxScore = branchScore.maxScore
          } else if (branch === undefined) {
            branchMaxScoreList.push(branchScore)
          }
        }
        // 计算加减分最终的结果
        for (let checkUser of checkUserList) {
          let branch = branchMaxScoreList.find(branch => branch.branchId === checkUser.branchId)
          if (branch === undefined) {
            checkUser.maxScore = 0
          } else {
            checkUser.maxScore = branch.maxScore
          }
          checkUser.finalExtra = parseFloat((checkUser.allScore + 10) * 9 / (checkUser.maxScore + 10)).toFixed(2)
        }
        return checkUserList
      },
      // 计算每用户的效能评价得分
      setKbiScore (checkUserList) {
        for (let checkUser of checkUserList) {
          let scoreItemList = []
          for (let scoreItem of checkUser.kbiList) {
            let score = 0
            for (var prop in scoreItem) {
              if (prop.indexOf('kbiId') >= 0) {
                let propItem = checkUser.kbiItemList.find(kbi => kbi.kbiId === parseInt(prop.replace('kbiId','')))
                if (propItem !== undefined && (!stringIsNull(scoreItem[prop]))) {
                  score += parseFloat(propItem.kbiRatio * scoreItem[prop] / 100)
                }
              }
            }
            scoreItem.everyAllScore = score
            let sItem = {
              score: score,
              ratio: 0.2,
              isGuider: false,
              isSameBranch: false
            }
            if (scoreItem.isGuider) {
              sItem.isGuider = true
              sItem.ratio = 0.4
            }
            if (scoreItem.isSameBranch) {
              sItem.isSameBranch = true
              sItem.ratio = 0.4
            }
            scoreItemList.push(sItem)
          }
          checkUser.scoreItemList = scoreItemList
          let kbiScoreOther = 0   // 其他成员总分数
          let kbiOhterNum = 0
          let kbiScoreGuider = 0  // 领导成员总分数
          let kbiGuiderNum = 0
          let kbiScoreBranch = 0  // 同部门成员总分数
          let kbiBranchNum = 0
          for (let scoreItem of checkUser.scoreItemList) {
            // 其他成员总分数
            if (scoreItem.ratio === 0.2) {
              kbiScoreOther += parseFloat(scoreItem.score * scoreItem.ratio)
              kbiOhterNum += 1
            } else {
              // 领导成员总分数
              if (scoreItem.isGuider) {
                kbiScoreGuider += parseFloat(scoreItem.score * scoreItem.ratio)
                kbiGuiderNum += 1
              }
              // 同部门成员总分数
              if (scoreItem.isSameBranch) {
                kbiScoreBranch += parseFloat(scoreItem.score * scoreItem.ratio)
                kbiBranchNum += 1
              }
            }
          }
          checkUser.kbiAllScore = parseFloat(kbiScoreOther / (kbiOhterNum === 0 ? 1 : kbiOhterNum)
            + kbiScoreGuider / (kbiGuiderNum === 0 ? 1 : kbiGuiderNum)
            + kbiScoreBranch / (kbiBranchNum === 0 ? 1 : kbiBranchNum)).toFixed(2)
        }
        return checkUserList
      },
      // 获取所有子部门
      getBranchChildList (branchlist) {
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
      getFinalKbiScore (item) {
        if (stringIsNull(item.standardScore)) {
          return ''
        } else {
          return Math.round(parseInt((1 + (parseFloat(item.kbiAllScore) * 0.9 + parseFloat(item.finalExtra) - 75) * 0.6 / 75) * 100) * item.standardScore / 100)
        }
      }
    }
  }
</script>

<style>
  .extra_item_title {
    width: 99%;
    padding: 5px;
    font-size: 11pt;
    font-weight: 700;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }

  .extra_item_title:hover {
    color: #0BB2D4;
  }

  .el-table__expanded-cell {
    padding: 0px;
  }

  .van-collapse-item__content {
    padding: 0px;
  }

  .el-form-item {
    margin-bottom: 2px;
  }

  .f17dt {
    font-size: 17px;
    font-weight: 700;
  }

  .tac {
    text-align: center;
  }

  .tar {
    text-align: right;
  }

  .w95 {
    width: 95%;
    margin: 10px auto 0;
  }

  .os {
    overflow: scroll;
  }

  .van-collapse-item__content {
    line-height: 1;
  }

  .coll_title {
    width: 100px;
    font-size: 15px;
    color: #0c0c0d;
    padding-top: 5px;
  }

  .bs {
    border-top: 1px dotted black;
    border-bottom: 1px dotted black;
  }

  .detail_td_style {
    font-weight: 600;
    overflow: hidden;
    font-size: 14px;
    color: black;
  }

  .f14cb {
    font-size: 14px;
    color: #666262;
  }

  .qkbtn {
    display: inline-block;
    border: 1px solid #DCDFE6;
    color: #FFF;
    font-size: 14px;
    background-color: #409EFF;
  }

  .data_title {
    font-weight: 600;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .bs td {
    padding-bottom: 5px;
  }

  .
  td {
    padding-top: 5px;
    padding-bottom: 7px;
  }

  .detail_score_style td:nth-child(2) {
    letter-spacing: 1px;
    line-height: 16px;
  }

  .score_title td {
    padding-top: 7px;
    font-weight: 600;
    padding-bottom: 7px;
  }
</style>
