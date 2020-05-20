<template>
  <div>
    <van-row type="flex" justify="center" class="mtmb5">
      <van-col span="21">
       <van-row type="flex" justify="center">
           <van-col span="18">
                <div class="uls">
          <div style="width:80%;">
            <button class="execbtn" style="width:90%;" @click="visibletrue()">{{title}}</button>
          </div>
          <div style="margin-right:5px;">
            <van-icon name="arrow-down" />
          </div>
        </div>
           </van-col>
       </van-row>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  props: ["title"],
  data: function() {
    return {
      
    };
  },
  watch: {

  },
  methods: {
    visibletrue() {
      this.$emit("vtrue");
    }
  },
  mounted() {}
};
</script>

<style scoped>

.execbtn {
  font-size: 13px;
  background: #fff;
  color: #777777;
  line-height: 20px;
  flex: 1;
  border: 0;
  height: 20px;
}
.uls{
border-bottom:1px solid rgb(0,0,0); height:20px;width:100%; display:flex; align-items:flex-end;justify-content:space-between;
}
.mtmb5{
margin-top:5px;margin-bottom:5px;
}
</style>
