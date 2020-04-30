<template>
  <div>
    <div class="header">{{title}}</div>
    <div class="check_group" >
      <van-checkbox-group v-model="result" ref="checkboxGroup">
        <van-checkbox v-for="item in dataList" :key="item.id" :name="item.id" style="padding: 5px;" shape>{{item.name}}</van-checkbox>
      </van-checkbox-group>
    </div>
    <div class="btn_bottom">
      <van-button plain @click="closeHandle">取消</van-button>
      <van-button type="info" @click="confirmHandle">确认</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
        default: Object
      },
      title: {
        type: String,
        default: ''
      },
      dataList: {
        type: Array,
        default: []
      }
    },

    data () {
      return {
        visible: false,
        result:[]
      }
    },
    watch: {
      value( val) {
        console.log(val)
      }
    },
    methods: {
      closeHandle () {
        this.$emit('close')
      },
      confirmHandle () {
        this.value.projectType = ''
        for (let dataItem of this.dataList) {
          for (let val of this.result) {
            if (dataItem.id === val) {
              this.value.projectType += dataItem.name + ','
            }
          }
        }
        if (this.value.projectType.length > 0) {
          this.value.projectType = this.value.projectType.substring(0, this.value.projectType.length - 1)
        }
        this.$emit('close')
      }
    },
    mounted () {
      if (this.value) {

        this.visible = true;
      }
    }
  }
</script>

<style scoped>
  .header{
    font-size: 13pt;
    font-weight: 700;
    text-align: center;
    width: 100%;
  }
  .check_group{
    max-height: 500px;
    margin-top: 4px;
    overflow-y: visible;
    overflow-x: hidden;
    width: 100%;
    text-align: left;
    padding: 2px;
    border-top: 1px solid #3b97d7;
  }
  .btn_bottom{
    border-top: 1px solid #3b97d7;
    display: flex;
    font-size: 14pt;
  }
  .btn_bottom button{
    width: 50%;
  }
</style>
