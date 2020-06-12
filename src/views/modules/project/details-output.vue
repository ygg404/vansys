<template>
  <van-dialog v-model="visible" confirm-button-text="返回" @confirm="visible = false">
    <template slot="title">
      <div style="font-size:18px;color:dodgerblue;">预计产值明细情况</div>
    </template>
    <div v-if="chooseRatio(dataList).length !== 0">
      <van-row type="flex" align="center" justify="space-around">
        <van-col span="6">作业类型</van-col>
        <van-col span="6">量单位</van-col>
      </van-row>
      <van-row>
        <van-col span="6" class="tac">产值单价</van-col>
        <van-col span="6" class="tac">难度系数</van-col>
        <van-col span="6" class="tac">工作量</van-col>
        <van-col span="6" class="tac">产值</van-col>
      </van-row>
      <div style="max-height:300px;overflow: scroll;">
        <div :key="item + index" v-for="(item, index) in chooseRatio(dataList)" style="margin-top:4px;padding-bottom:4px;border-bottom:1px dotted black;">
          <van-row>
            <van-col span="12"class="vcc">{{item.typeName}}</van-col>
            <van-col span="12"class="vcc">{{item.unit}}</van-col>
          </van-row>
          <van-row>
            <van-col span="6"class="vcc">{{item.unitOutput}}</van-col>
            <van-col span="6"class="vcc">{{item.projectRatio}}</van-col>
            <van-col span="6"class="vcc">{{item.workLoad}}</van-col>
            <van-col span="6"class="vcc">{{item.typeOutput}}</van-col>
          </van-row>
        </div>
      </div>
    </div>
    <div v-else class="nodatasty">
      暂无数据
    </div>
  </van-dialog>
</template>

<script>
  export default {
    data(){
      return{
        visible:false,
        dataList:[],
        dataDetail:''
      }
    },

    methods:{
      init(workTypelist,dataForm){
        this.dataList = workTypelist
        this.dataDetail = dataForm
        this.visible = true
      },
      // 工作类型在表格勾选显示
      chooseRatio (params) {
        //  console.log(params)
        let temp = []
        params.forEach(e => {
          if (e.checked) {
            e.typeOutput = this.numFilter(
              e.workLoad * e.projectRatio * e.unitOutput
            )
            if (e.projectRatio == null || e.workLoad == null) {
              e.projectRatio = 1
              e.workLoad = 0
            }
            temp.push(e)
          }
        })
        return temp
      },
      // 保留小数点后两位的过滤器，尾数不四舍五入
      numFilter (value) {
        // 截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3)
        let realVal = tempVal.substring(0, tempVal.length - 1)
        return realVal
      },
    }
  }
</script>

<style>
  .tac{
    text-align:center;
  }
  .vcc{
    color:#a6a1a1;font-size:14px;text-align:center
  }
  .nodatasty{
    margin-top:5px;text-align:center;color:rgb(125, 127, 130);
  }
</style>
