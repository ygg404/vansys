<template>
  <van-dialog width="80%" :showConfirmButton="noshowBtn" :showCancelButton="noshowBtn" :closeOnClickOverlay="overlayclick" @cancel="visible = false" v-model="visible">
    <template slot="title">
      <div class="span_header">参评人数:<span>{{person}}</span></div>
    </template>
    <div style="width:95%;margin-top:0px;margin-bottom:20px;margin:auto;">
      <van-row style="margin-bottom:10px;">
        <van-col span="12" class="span_header tac">用户名</van-col>
        <van-col span="12" class="span_header tac">是否提交</van-col>
      </van-row>
      <van-list v-model="userListShow" :finished="userListShow" style="border-top:1px solid black;padding-top:5px;">
        <van-row :key="item.userName + index" v-for="(item,index) in uRoleList" style="margin-bottom:4px;">
          <van-col span="12">
            <div class="tac">
              {{item.userName}}
            </div>
          </van-col>
          <van-col span="12" class="tac">
            <van-tag v-if="item.isAssess" type="primary">已提交</van-tag>
            <van-tag v-else>未提交</van-tag>
          </van-col>
        </van-row>
      </van-list>
    </div>
  </van-dialog>
</template>

<script>
  export default {
    data () {
      return {
        noshowBtn:false,
        overlayclick:true,
        visible: false,
        userListShow:false,
        uRoleList: [],
        dataForm: {
          curYear: '',
          updown: 0
        },
        person: 0
      }
    },
    methods: {
      init (dataForm) {
        this.dataForm = dataForm
        this.getUaccessList().then(list => {
          this.uRoleList = list
          this.person = this.getAssessPerson(list)
        })
        this.visible = true
      },
      // 获取已经评分的用户列表
      getUaccessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/perf/access/uAssessList`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curYear.getFullYear(),
              updown: this.dataForm.updown
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
      // 显示参加评选人数
      getAssessPerson (list) {
        let person = 0
        for (let assess of list) {
          if (assess.isAssess) person += 1
        }
        return person
      }
    }
  }
</script>

<style scoped>
  .user_card {
    max-height: 500px;
    overflow-y: auto;
    box-shadow: 5px 5px 3px #1fd3e9;
    border: 1px solid #1fd3e9;
  }
  .span_header {
    font-weight: 700;
    font-size: 16px;
  }
  .span_header span{
    color: green;
  }
  .tac{
    text-align:center;
  }

</style>
