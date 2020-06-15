<template>
     <van-row style="margin-top:5px;margin-bottom:5px;" type="flex" align="center">
      <van-col span="1" />
      <van-col span="11" class="wgns">
        <van-cell center @click="wgshow = true" style="width:80%;">作业组:{{wgName}}</van-cell>
        <van-popup v-model="wgshow" position="bottom">
          <van-picker
            show-toolbar title="选择作业组" value-key="name" :columns="wgList"
            @cancel="wgshow = false" @confirm="onworkGroupConfirm"/>
        </van-popup>
      </van-col>
       <van-col span="13">
         <van-row>
           <van-col span="12"><van-button type="primary" size="small" @click="exportChartHandle">导出Excel</van-button></van-col>
           <van-col span="12"><van-button type="info" size="small" @click="goBack">返回</van-button></van-col>
         </van-row>
       </van-col>
    </van-row>
</template>

<script>
  export default {
    props: {
        // 作业组名
      wgName: {
        type: String,
        default: ''
      },
      // 作业组数组
      wgList: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        wgshow: false
      }
    },
    methods: {
      onworkGroupConfirm (item) {
        this.wgshow = false
        this.$emit('wgc', item)
      },
      exportChartHandle () {
        this.$emit('ech')
      },
      goBack () {
        this.$emit('gb')
      }
    }
  }
</script>

<style scoped>
 .wgns .van-cell{
 padding:10px 0px;
}
 .wgns .van-cell__value{
   border:1px dotted #d7d2d2;
 }
.operrow .van-button{
height: 37px;
border-radius: 5px;
}
</style>
