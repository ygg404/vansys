<template>
  <div>
    <slot v-bind:itemValue = "todoStr" >
      {{todoStr}}
    </slot>
  </div>
</template>

<script>

  export default {
    props: {
      //数组
      List: {
        type: Object,
        default: null
      },
      //下标
      num:{
        type:Number,
        default:0
      }
    },
    data () {
      return {
        todoList:this.List,
        todoNum:this.num,
        todoStr:''
      }
    },
    created(){
      var numStr = 'kbiId' + this.todoNum
      this.todoStr = this.todoList[numStr]
    },
    methods: {
    }
  }
</script>


