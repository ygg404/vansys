<template>
  <div v-loading="dataListLoading" >

    <el-form :inline="true" :model="dataForm" style="margin-top:10px;">
      <div style="width:95%;margin:0 auto;">
        <el-form-item>
          <span style="font-size:15px;">考核时间:</span>
          <el-date-picker v-model="dataForm.curTime" type="month" placeholder="选择年月" @change="init"></el-date-picker>
        </el-form-item>
      </div>
      <div style="width:95%;margin:0 auto;">
        <el-form-item>
          <span style="font-size:15px;">考核状态:</span>
          <el-tag type="info" v-if="!isPost">未提交</el-tag>
          <el-tag type="success" v-if="isPost">已提交</el-tag>
        </el-form-item>
      </div>
    </el-form>

    <div class="accesscchart_title">
      {{dataForm.curTime.getFullYear() + '年' + (dataForm.curTime.getMonth() + 1) + '月' + '效能考核'}}
    </div>

    <div :style="'max-height: ' + (documentClientHeight - 270).toString() + 'px'" class="access_table_content">
      <div  v-for="(kbiRole,indexA) in kbiRoleList" style="margin-bottom: 10px;" :key="kbiRole.roleId" v-if="isAttend">
        <div style="font-size: 15px;color: #3b97d7;">
          <span>{{kbiRole.roleName + ':'}}</span>
        </div>
        <table class="accesstable">
          <thead>
          <tr>
            <td style="min-width:200px;font-weight: 600;font-size:15px;">考核项</td>
            <td class="tac" style="min-width:80px;font-weight: 600;font-size:15px;">占比(%)</td>
            <td v-for="(user,indexB) in kbiRole.userList" class="name_title">{{user.username}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,indexC) in kbiRole.kbiList">
            <td>{{item.kbiName}}</td>
            <td class="tac">{{item.kbiRatio}}</td>
            <td v-for="user in kbiRole.userList">
              <div>
                <van-field  v-model="item['kbiScore' + user.userId]" input-align="center" disabled class="ds" v-if="item.kbiRatio == 0">
                  <template slot="right-icon">
                    <van-icon name="arrow-down" />
                  </template>
                </van-field>
                <van-field  v-model="item['kbiScore' + user.userId]" input-align="center" disabled @click="scorePickEvent(user.username,item.kbiName, indexA,user.userId,indexC)" v-else>
                  <template slot="right-icon">
                    <van-icon name="arrow-down" />
                  </template>
                </van-field>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
       <div v-if="isAttend === false">
        <span style="color:red;font-weight:700;font-size: 15px;"> 当前年度此用户没有参评的权限！请联系管理员设置！</span>
      </div>
    </div>

    <div class="btn_line">
      <el-button type="primary" size="large" @click="dataFormSubmit">提交评分</el-button>
    </div>

    <van-popup  v-model="scorePickerShow" position="bottom" >
      <van-picker show-toolbar :title="scoretitle" value-key="rateItem" :columns="rateList"
                  @cancel="scorePickerShow = false" @confirm="onScoreConfirm"/>
    </van-popup>

  </div>
</template>

<script>
  // import AddOrUpdate from './perfaccess-add-or-update'
  import {getYearItem, getRateItem} from '@/utils/selectedItem'
  import {stringIsNull} from '../../../utils'

  export default {
    data () {
      return {
        isAttend:false,
        // 评分弹窗标题
        scoretitle: '',
        scorePickerShow: false,
        partA: '',
        partB: '',
        partC: '',
        dataForm: {
          key: '',
          curTime: ''
        },
        yearItemList: getYearItem(),
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        userKbiList: [],
        kbiRoleList: [],   // 角色考核项关系表
        isPost: false, // 是否提交
        rateList: getRateItem(), // 评分列表
        perfAccessList: []  // 评分明细表
      }
    },
    computed: {
      userId: {
        get () {
          return this.$store.state.user.id
        },
        set (val) {
          this.$store.commit('user/updateId', val)
        }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    created () {
      this.dataForm.curTime = new Date()
      this.init()
    },
    methods: {
      scorePickEvent (username, kbiName, A, B, C) {
        this.scoretitle = username + '-' + kbiName + '-' + '评分'
        this.partA = A
        this.partB = B
        this.partC = C
        this.scorePickerShow = true
      },
      onScoreConfirm (item) {
        this.kbiRoleList[this.partA].kbiList[this.partC]['kbiScore' + this.partB ] = item.id
        this.scorePickerShow = false
      },
      // 对部分值进行处理
      initItem () {
        for (let itemA of this.kbiRoleList) {
          for (let itemB of itemA.userList) {
            for (let itemC of itemA.kbiList) {
              if (itemC['kbiScore' + itemB.userId] === null) {
                itemC['kbiScore' + itemB.userId] = ' '
              }
            }
          }
        }
      },
      // 时间初始化
      init () {
        this.dataListLoading = true
        this.getPerfAccessVoList().then(accessList => {
          this.kbiRoleList = this.kbiRoleInit(accessList)
          this.initItem()
          this.getUserIsAttend().then(data =>{
            if(stringIsNull(data)){
              this.isAttend = false
            }else{
              this.isAttend = true
            }
          })
          this.dataListLoading = false
        })
      },
      // 获取当前年份 用户的评分表
      getPerfAccessVoList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/perf/access/volist`),
            method: 'get',
            params: this.$http.adornParams({
             year: this.dataForm.curTime.getFullYear(),
             month: this.dataForm.curTime.getMonth() + 1,
             userId: this.userId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.isPost = data.isPost
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取角色与KBI关系列表
      getRoleKbiList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/sys/kbiVo/roleKBIList`),
            method: 'get',
            params: this.$http.adornParams()
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
      // 考核项目初始列表
      kbiRoleInit (accessList) {
        let kbiRoleList = []
        let roleId = 0
        let kbiId = 0
        let kbiIndex = 0
        let userId = 0
        // 考核项目根据角色分类
        let index = 0
        for (let roleKbi of accessList) {
          if (roleKbi.roleId !== roleId) {
            kbiId = 0
            roleId = roleKbi.roleId
            let kbiItem = {
              roleId: roleKbi.roleId,
              roleName: roleKbi.roleName,
              kbiList: [],
              userList: []
            }
            kbiRoleList.push(kbiItem)
          }
          if (roleKbi.kbiId > kbiId) {
            kbiRoleList[kbiRoleList.length - 1].kbiList.push({
              kbiId: roleKbi.kbiId,
              kbiName: roleKbi.kbiName,
              kbiRatio: roleKbi.kbiRatio
            })
            kbiId = roleKbi.kbiId
          }
          if (roleKbi.kbiId > kbiIndex) {
            kbiIndex = roleKbi.kbiId
            // 下个用户的评分项下标
            index += 1
          } else {
            kbiIndex = 0
            // 下个用户的评分项下标
            index = 1
          }
          // 根据被考核人的各考核项分数下标赋值
          kbiRoleList[kbiRoleList.length - 1].kbiList[index - 1]['kbiScore' + roleKbi.userId] = roleKbi.kbiScore
        }
        // 用户根据角色分类
        userId = 0
        for (let kbiRole of accessList) {
          kbiRoleList.map(item => {
            if (item.roleId === kbiRole.roleId) {
              if (kbiRole.userId !== userId) {
                item.userList.push({
                  userId: kbiRole.userId,
                  username: kbiRole.userName
                })
                userId = kbiRole.userId
              }
            }
          })
        }
        console.log(kbiRoleList)
        return (kbiRoleList)
      },
        // 获取当前用户是否有参评资格
      getUserIsAttend () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbicheck/info`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curTime.getFullYear(),
              month: this.dataForm.curTime.getMonth() + 1
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.renKbiCheck)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取统计方法
      getSummaryMethod (param) {
        const { columns, data } = param
        const sums = []
        let colList = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '分数合计：'
            return
          }
          if (index === 1) {
            colList = data.map(item => (item[column.property]))
            sums[index] = '/'
            return
          }
          if (index > 1) {
            const values = data.map(item => (item[column.property]))
            let sum = 0
            let i = 0
            for (let value of values) {
              sum += stringIsNull(value) ? 0 : parseFloat(parseFloat(value) * parseFloat(colList[i]) / 100)
              i += 1
            }
            sums[index] = sum.toFixed(2)
          }
        })
        return sums
      },
      dataFormSubmit () {
        let perfAccessList = []
        for (let roleKbi of this.kbiRoleList) {
          for (let item of roleKbi.kbiList) {
            for (var prop in item) {
              let accessItem = {
                userId: this.userId,
                userName: this.userName,
                year: this.dataForm.curTime.getFullYear(),
                month: this.dataForm.curTime.getMonth() + 1,
                kbiId: item.kbiId,
                kbiName: item.kbiName,
                kbiRatio: item.kbiRatio
              }
              if (prop.indexOf('kbiScore') !== -1) {
                if ((stringIsNull(item[prop]) && item.kbiRatio !== 0) || (item[prop] === 'null' && item.kbiRatio !== 0) || (item[prop] === ' ' && item.kbiRatio !== 0)) {
                  this.$notify({
                    message: '有填写项为空！'
                  })
                  return
                } else {
                  // 该考核项考核人对被考核人的评分
                  accessItem.kbiScore = item[prop]
                  // 被考核人id
                  accessItem.checkUserId = parseInt(prop.replace('kbiScore', ''))
                  accessItem.checkUserName = roleKbi.userList.find(user => user.userId === accessItem.checkUserId)['username']
                  perfAccessList.push(accessItem)
                }
              }
            }
          }
        }
        this.$http({
          url: this.$http.adornUrl(`/perf/access/saveList`),
          method: 'post',
          data: this.$http.adornData({
            'userId': this.userId,
            'year': this.dataForm.curYear.getFullYear(),
            'updown': this.dataForm.updown,
            'accessList': perfAccessList
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500
            })
            this.kbiRoleList = []
            this.init()
          } else {
            this.$message.error(data.msg)
          }
        })
        console.log(perfAccessList)
      }
    }
  }
</script>

<style scoped>
  .btn_line{
    padding: 10px;
    width: 100%;
    text-align: center;
  }
  .el-form-item{
    margin-bottom: 2px;
  }
  .accesscchart_title{
    width: 95%;
    text-align: center;
    margin: 5px auto 10px;
    padding-bottom:5px;
    border-bottom:1px dotted black;
    font-size: 17px;
    font-weight: 700;
  }
  .tac{
    text-align:center;
  }
  .access_table_content{
    width:95%;margin:0 auto;overflow: scroll;
  }
  table{border:0;border-collapse:collapse}
  .accesstable td{border:1px solid #EEEEEE;border-collapse:collapse}
  .access_table_content .van-cell{
    padding:3px;
  }
  .ds{
    background-color:#eff1f4;;
  }
  .name_title{
    min-width:100px;font-size:15px;text-align:center;
  }
</style>
