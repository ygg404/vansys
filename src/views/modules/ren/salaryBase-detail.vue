<template>
  <van-dialog v-model="visible" confirmButtonText="返回" @confirm="visible = false">
    <template slot="title">
      <div class="fw600">{{titleName}}</div>
    </template>
    <div align="center">
      <div class="fds" style="margin-top:10px;">
        <van-row class="frs">
          <van-col span="12" class="fw600">学历评分</van-col>
          <van-col span="12" class="fw600">分数:<span style="color:dodgerblue;">{{person.edAllscore}}</span></van-col>
        </van-row>
        <van-row>
          <van-col span="12">学制:{{person.edTypename}}</van-col>
          <van-col span="12">系数:{{person.edTypescore}}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">专业性质:{{person.edProname}}</van-col>
          <van-col span="12">系数:{{person.edProscore}}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">学历:{{person.edName}}</van-col>
          <van-col span="12">基准分:{{person.edScore}}</van-col>
        </van-row>
      </div>
      <!---->
      <div class="fds">
        <van-row class="frs">
          <van-col span="12" class="fw600">职称评分</van-col>
          <van-col span="12" class="fw600">分数: <span style="color:dodgerblue;">{{person.titleAllscore}}</span></van-col>
        </van-row>
        <van-row>
          <van-col span="12">专业性质:{{person.titleProname}}</van-col>
          <van-col span="12">系数:{{person.titleProscore}}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">职称:{{person.titleName}}</van-col>
          <van-col span="12">基准分:{{person.titleScore}}</van-col>
        </van-row>
      </div>

      <div class="fds">
        <van-row class="frs">
          <van-col span="12" class="fw600">工龄评分</van-col>
          <van-col span="12" class="fw600">分数: <span style="color:dodgerblue;">{{person.workScore}}</span></van-col>
        </van-row>
        <van-row>
          <van-col span="12">参加工作时间</van-col>
          <van-col span="12">{{person.educationTime}}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">入职时间</van-col>
          <van-col span="12">{{person.entryTime}}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">司龄</van-col>
          <van-col span="12">{{person.firmYear}}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">他龄</van-col>
          <van-col span="12">{{person.otherYear}}</van-col>
        </van-row>
        <van-row>
          <van-col span="12">工龄</van-col>
          <van-col span="12">{{person.workYear}}</van-col>
        </van-row>
      </div>

      <div class="fds">
        <van-row class="frs">
          <van-col span="12" class="fw600">职务评分</van-col>
          <van-col span="12" class="fw600">分数: <span style="color:dodgerblue;">{{person.dutyScore}}</span></van-col>
        </van-row>
        <van-row>
          <van-col span="12">职务</van-col>
          <van-col span="12">{{person.dutyName}}</van-col>
        </van-row>

      </div>
    </div>

    <div style="padding-left:5%;">
      <div class="f15">
        <span class="fw600">总分:</span>
        <span style="color: red;font-weight:600;">{{person.edAllscore + person.titleAllscore + person.workScore + person.dutyScore}}</span>
      </div>
      <div class="f15">
        <span class="fw600">职级:</span>
        <span style="color:dodgerblue;">{{person.jobRank}}</span>
        <span class="fw600">效能分:</span>
        <span style="color:dodgerblue;">{{person.kbiFinalScore}}</span>
        <span class="fw600">效能工资:</span>
        <span style="color:dodgerblue;">{{person.kbiSalary}}</span>
      </div>
      <div class="f15">
        <span class="fw600">固定工资:</span>
        <span style="color: #1989fa;">{{person.fixedSalary}}</span>
      </div>
      <div class="f15">
        <span class="fw600">住房补贴:</span>
        <span style="color: #1989fa">{{person.housingSalary}}</span>
      </div>
      <div class="f15">
        <span class="fw600">工资合计:</span>
        <span style="color: red;font-weight:600;">{{person.fixedSalary + person.housingSalary + person.kbiSalary}}</span>
      </div>
    </div>
  </van-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        person: '',
        titleName: ''
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.person = item
        this.titleName = '个人工资计算明细' + ':' + '(' + this.person.username + ')'
      }
    }
  }
</script>

<style scoped>
  .f15{
    font-size:15px;
  }
  .fw600{
    font-weight:600;
  }
  .pl2{
    padding-left:2%;
  }
  .fds{
    margin:0 auto;width:90%;padding-bottom:2px;margin-bottom:10px;
  }
  .frs{
    margin-bottom:2px;border-bottom:1px dotted black;
  }
</style>
