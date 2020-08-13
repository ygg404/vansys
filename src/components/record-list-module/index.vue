<template>
  <div style="width:90%;margin:0 auto;max-height:300px;overflow: scroll;">
    <div v-if="typeNum === '1'">
      <div v-if="dataList.length !== 0">
        <div :key="item + index" v-for="(item,index) in dataList" class="btb">
          <van-row class="mtb3">
            <van-col span="6" class="tac bc">{{titleList[0]}}:</van-col>
            <van-col span="18" class="zwfs f14">{{item.startDate}}至 {{item.endDate}}</van-col>
          </van-row>
          <van-row class="mtb3">
            <van-col span="6" class="tac bc">{{titleList[1]}}:</van-col>
            <van-col span="18" class="zwfs f14">{{item.educationBackground}}</van-col>
          </van-row>
          <van-row class="mtb3">
            <van-col span="6" class="tac bc">{{titleList[2]}}:</van-col>
            <van-col span="18" class="zwfs f14">{{item.educationSchool}}</van-col>
          </van-row>
          <van-row class="mtb3">
            <van-col span="6" class="tac bc">{{titleList[3]}}:</van-col>
            <van-col span="18" class="zwfs f14">{{item.major}}</van-col>
          </van-row>
        </div>
      </div>
      <div v-else class="tac mtb5 zwfs">
        暂无数据
      </div>
    </div>
    <div v-if="typeNum === '2'">
      <div v-if="dataList.length !== 0">
        <div :key="item + index" v-for="(item,index) in dataList" class="btb">
          <van-row class="mtb3">
            <van-col span="6" class="tac bc">{{titleList[0]}}:</van-col>
            <van-col span="18" class="zwfs f14">{{item.startDate}}至
            <span v-if="item.endDate !== null">{{item.endDate}}</span>
              <span v-else>今</span>
            </van-col>
          </van-row>
          <van-row class="mtb3">
            <van-col span="6" class="tac bc">{{titleList[1]}}:</van-col>
            <van-col span="18" class="zwfs f14">{{item.company}}</van-col>
          </van-row>
          <van-row class="mtb3">
            <van-col span="6" class="tac bc">{{titleList[2]}}:</van-col>
            <van-col span="18" class="zwfs f14">{{item.jobPosition}}</van-col>
          </van-row>
          <van-row class="mtb3">
            <van-col span="6" class="tac bc">{{titleList[3]}}:</van-col>
            <van-col span="18" class="zwfs f14">{{item.jobDescription}}</van-col>
          </van-row>
        </div>
      </div>
      <div v-else class="tac mtb5 zwfs">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // 类型 1 教育背景 2 工作经验
      typeNum: {
        type: String,
        default: '0'
      },
      // 数组对象
      dataList: {
        type: Array,
        default: []
      },
      // 标题数组
      titleList: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        ff: false
      }
    },
    watch: {

    },
    methods: {
    },
    mounted () {}
  }
</script>

<style scoped>
.tac{
  text-align:center;
}
  .mtb5{
    margin-top:5px;
    margin-bottom:5px;
  }
  .mtb3{
    margin-top:3px;
    margin-bottom:3px;
  }
  .zwfs{
    color:#96999f;
  }
  .bc{
    color:black;
  }
  .f14{
    font-size:14px;
  }
  .btb{
    border-top:1px dotted #979090;;
    border-bottom:1px dotted #979090;;
  }
</style>
