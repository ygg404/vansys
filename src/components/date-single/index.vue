<template>
<!--    <van-cell center title="日期选择"  :value="dateVal" @click="dateshow = true" />-->
    <van-calendar title="日期选择" v-model="value" @confirm="dateConfirm" :default-date="defaultDate" bind:close="closeHandle"
                  :min-date="minDate" :max-date="maxDate"   color="#1989fa"/>
</template>

<script>
  import moment from 'moment'

  export default {
    props: ['value'],
    // computed: {
    //   dateshow: function () {
    //     return this.value
    //   }
    // },
    data () {
      return {
        minDate: new Date(2010 , 0 ,1),
        maxDate: new Date(2050, 11 , 31),
        defaultDate: new Date()
      }
    },
    methods: {
      closeHandle () {
        // this.value = false
        console.log('close')
        this.value = false
      },
      dateConfirm (date) {
        // this.value = false
        this.value = false
        this.$emit( 'change', moment(date).format('YYYY-MM-DD'))
      }
    }
  }
</script>

<style scoped>

</style>
