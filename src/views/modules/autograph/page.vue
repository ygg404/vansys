<template>
  <div>
    <div class="boardBox" ref="boardBox">
      <canvas ref="board"
              @touchstart="mStart"
              @touchmove="mMove"
              @touchend="mEnd">
      </canvas>
    </div>
    <van-row type="flex" justify="center">
      <van-col span="8">
        <van-button @click="cleanText()">清除</van-button>
      </van-col>
      <van-col span="8">
        <van-button @click="commitText()">提交</van-button>
      </van-col>
    </van-row>
    <img class="imgCanvas" :src="imgUrl">
  </div>
</template>

<script>
  import lrz from 'lrz'

  export default {
    data () {
      return {
        imgUrl: '',
        ctx: null,
        point: {
          x: 0,
          y: 0
        },
        moving: false  // 是否正在绘制中且移动
      }
    },
    mounted () {
      let board = this.$refs.board  // 获取DOM
      board.width = this.$refs.boardBox.offsetWidth // 设置画布宽
      board.height = this.$refs.boardBox.offsetHeight  // 设置画布高
      this.ctx = board.getContext('2d')  // 二维绘图
      this.ctx.strokeStyle = 'red'  // 颜色
      this.ctx.lineWidth = 3 // 线条宽度
    },
    methods: {
      // 触摸(开始)
      mStart (e) {
        console.log(e)
        let x = e.touches[0].clientX - e.target.offsetLeft,
          y = e.touches[0].clientY - e.target.offsetTop  // 获取触摸点在画板（canvas）的坐标
        this.point.x = x
        this.point.y = y
        this.ctx.beginPath()
        this.moving = true
      },
      // 滑动中...
      mMove (e) {
        if (this.moving) {
          let x = e.touches[0].clientX - e.target.offsetLeft,
            y = e.touches[0].clientY - e.target.offsetTop  // 获取触摸点在画板（canvas）的坐标
          this.ctx.moveTo(this.point.x, this.point.y)  // 把路径移动到画布中的指定点，不创建线条(起始点)
          this.ctx.lineTo(x, y) // 添加一个新点，然后创建从该点到画布中最后指定点的线条，不创建线条
          this.ctx.stroke() // 绘制
          this.point.x = x, this.point.y = y  // 重置点坐标为上一个坐标
        }
      },
      // 滑动结束
      mEnd () {
        if (this.moving) {
          this.ctx.closePath()  // 停止绘制
          this.moving = false  // 关闭绘制开关
        }
      },
      //清除签名
      cleanText () {
        this.ctx.clearRect(0, 0, this.$refs.board.width, this.$refs.board.height)
      },

      commitText () {
        let that = this
        // this.imgUrl=this.$refs.board.toDataURL();
        let options = {
          quality: 0.5,
          width: 900,
          height: 900
        }
        lrz(that.$refs.board.toDataURL(), options)
          .then(function (rst) {
            that.imgUrl = rst.base64
          }).catch(function (error) {
        }).always(function () {
          that.commitToAutograph()
        })
      },

      commitToAutograph () {
        this.$http({
          url: this.$http.adornUrl('/project/projectarchives/operAutographExcel'),
          method: 'get',
          params: this.$http.adornParams({
            'autograph': this.imgUrl
          }),

        }).then(({data}) => {

        })
      },

    }
  }
</script>

<style>
  .boardBox {
    margin: 20px auto;
    width: 90vw;
    height: 25vh;
    border: 1px solid #c7bdbd;

  }
</style>



