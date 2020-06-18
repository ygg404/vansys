<template>
  <div @click="visibletrue()">
    <van-row type="flex" justify="center">
      <van-col span="14">
        <div class="uls">
          <div>
            <button class="execbtn">{{title}}</button>
          </div>
          <div style="margin-right:5px;">
            <van-icon name="arrow-down"/>
          </div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
  export default {
    props: ['title'],
    data: function () {
      return {

      }
    },
    watch: {

    },
    methods: {
      visibletrue () {
        this.$emit('vtrue')
      }
    },
    mounted () {}
  }
</script>

<style scoped>

  .execbtn {
    font-size: 14px;
    background: #fff;
    color: #777777;
    line-height: 35px;
    flex: 1;
    border: 0;
    height: 30px;
  }
  .uls{
    margin-top:5px;margin-bottom:5px;border-bottom:1px solid rgb(0,0,0); height:30px;width:100%; display:flex; align-items:flex-end;justify-content:space-between;
  }
  .mtmb5{
    margin-top:5px;margin-bottom:5px;
  }
</style>
