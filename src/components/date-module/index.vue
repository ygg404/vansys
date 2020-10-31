<template>
  <van-row type="flex" justify="space-between" align="bottom" style="border-top: 1px solid rgb(195, 197, 199); border-bottom: 1px solid rgb(195, 197, 199);">
    <van-col span="12" >
      <van-cell   center title="开始日期"  :value="startDateVal" @click="startDateshow = true" />
      <van-calendar title="开始日期选择" v-model="startDateshow" @confirm="startDateConfirm" :default-date="startDate"
                    :min-date="minStartDate" :max-date="maxStartDate" />
    </van-col>
    <van-col span="12">
      <van-cell  center  title="结束日期"  :value="endDateVal" @click="endDateshow = true" />
      <van-calendar title="结束日期选择" v-model="endDateshow" @confirm="endDateConfirm" :default-date="endDate"
                    :min-date="minEndDate" :max-date="maxEndDate"  color="@stylecolor"/>
    </van-col>
  </van-row>
</template>

<script>
  import moment from 'moment'

  export default {
    props: ['value'], // 接收一个 value prop
    computed: {
      startDateVal: function () {
        return this.value.startDate
      },
      endDateVal: function () {
        return this.value.endDate
      }
    },
    data () {
      return {
        startDateshow: false,
        endDateshow: false,
        minStartDate: new Date(2010 , 0 ,1),
        maxStartDate: new Date(this.value.endDate.split('-')[0], parseInt(this.value.endDate.split('-')[1]) - 1, parseInt(this.value.endDate.split('-')[2]) - 1),
        minEndDate: new Date(this.value.startDate.split('-')[0], parseInt(this.value.startDate.split('-')[1]) - 1, parseInt(this.value.startDate.split('-')[2]) + 1),
        maxEndDate: new Date(2050, 11 , 31),
        startDate: new Date(this.value.startDate),
        endDate: new Date(this.value.endDate)
      }
    },
    methods: {
      startDateConfirm (date) {
        this.value.startDate = moment(date).format('YYYY-MM-DD')
        this.startDate = date
        this.minEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        this.startDateshow = false
        this.$emit('change', this.value)
      },
      endDateConfirm (date) {
        this.value.endDate = moment(date).format('YYYY-MM-DD')
        this.endDate = date
        this.maxStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
        this.endDateshow = false
        this.$emit('change', this.value) // 触发 input 事件，并传入新值
      }
    }
  }
</script>

<!--<style scoped>-->
  <!--.van-cell__value span{-->
    <!--color: #1989fa;-->
  <!--}-->
<!--</style>-->
<style lang="less">
.calendar_color{
  background-color:@stylecolor;
}
</style>
