<template>
  <div class="site-main" :style="{ 'height': documentClientHeight + 'px' }">
    <div class="main-navbar">项目签名</div>
    <van-row type="flex" justify="center" class="line_pro">
      <van-col span="5">项目编号:</van-col>
      <van-col span="18"><span>{{projectInfo.projectNo}}</span></van-col>
    </van-row>
    <van-row type="flex" justify="center"  class="line_pro">
      <van-col span="5">项目名称:</van-col>
      <van-col span="18"><span>{{projectInfo.projectName}}</span></van-col>
    </van-row>
    <van-row type="flex" justify="center"  class="line_pro">
      <van-col span="5">委托单位:</van-col>
      <van-col span="18"><span>{{projectInfo.projectAuthorize}}</span></van-col>
    </van-row>
    <van-row type="flex" justify="center"  class="line_pro">
      <van-col span="5">单位签名:</van-col>
      <van-col span="18"><img class="sig_canvas" :src="projectInfo.sigImage"></van-col>
    </van-row>

    <div class="box">
      <span>签名处：</span>
      <div class="boardBox" ref="boardBox">
        <canvas ref="board" @touchstart="mStart" @touchmove="mMove" @touchend="mEnd"></canvas>
      </div>
      <van-row type="flex" justify="center" style="margin-top: 20px;">
        <van-col span="8">
          <van-button @click="cleanText()" type="danger" icon="cross">清除</van-button>
        </van-col>
        <van-col span="8">
          <van-button @click="commitData()" type="info" icon="checked">提交签名</van-button>
        </van-col>
      </van-row>

    </div>

    <!-- <div class="site-bottom">
      <div>Copyright © 2020 gdjxch.cn All rights reserved.</div>
      <div><a href="http://www.beian.miit.gov.cn">粤ICP备19096985号</a></div>
    </div> -->
  </div>
</template>

<script>
  import lrz from 'lrz'

  export default {
    data () {
      return {
        canCommitFlag: 'save',
        imgUrl: '',
        ctx: null,
        point: {
          x: 0,
          y: 0
        },
        moving: false,  // 是否正在绘制中且移动
        // 需要提交的数据
        dataForm: {
          // Id: 0,
          projectNo: '',
          sigImage: '',
          createUserId: '',
          createUserName: '',
          crateTime: '',
          projectName: ''
        },
        projectInfo: ''
      }
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight - 100
        },
        set (val) {
          this.$store.commit('common/updateDocumentClientHeight', val)
        }
      },
    },
    created () {
      var arg = window.location.href.substring(0)
      var num = arg.indexOf('projectNo=')
      var part = arg.substring(num, arg.length)
      var projectStrNum = part.indexOf('=') + 1
      // 得到URL地址中的projectNo
      var projectNo = part.substring(projectStrNum, projectStrNum.length)
      // 传projectNo 请求后台 得到项目信息用于显示
      this.getProjectArchivesInfo(projectNo).then(success => {

      })
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
      getProjectArchivesInfo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/dop/archives/info'),
            method: 'get',
            params: this.$http.adornParams({
              projectNo: projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectInfo = data.archives
              resolve(data)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 触摸(开始)
      mStart (e) {
        let x = e.touches[0].clientX - e.target.offsetLeft
        let y = e.touches[0].clientY - e.target.offsetTop  // 获取触摸点在画板（canvas）的坐标
        this.point.x = x
        this.point.y = y
        this.ctx.beginPath()
        this.moving = true
      },
      // 滑动中...
      mMove (e) {
        if (this.moving) {
          let x = e.touches[0].clientX - e.target.offsetLeft
          let y = e.touches[0].clientY - e.target.offsetTop  // 获取触摸点在画板（canvas）的坐标
          this.ctx.moveTo(this.point.x, this.point.y)  // 把路径移动到画布中的指定点，不创建线条(起始点)
          this.ctx.lineTo(x, y) // 添加一个新点，然后创建从该点到画布中最后指定点的线条，不创建线条
          this.ctx.stroke() // 绘制
          this.point.x = x
          this.point.y = y  // 重置点坐标为上一个坐标
        }
      },
      // 滑动结束
      mEnd () {
        if (this.moving) {
          this.ctx.closePath()  // 停止绘制
          this.moving = false  // 关闭绘制开关
        }
      },
      // 清除签名
      cleanText () {
        this.ctx.clearRect(0, 0, this.$refs.board.width, this.$refs.board.height)
      },
      // 提交签名
      commitData () {
        let that = this
        let options = {
          quality: 0.5,
          width: 900,
          height: 450
        }
        lrz(that.$refs.board.toDataURL(), options)
          .then(function (rst) {
            that.projectInfo.sigImage = rst.base64
            that.updateProjectAuth()
          })
          .catch(function (error) {
          })
      },
      // 提交签名
      updateProjectAuth () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/dop/archives/update`),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': this.projectInfo.projectNo,
              'sigImage': this.projectInfo.sigImage
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '提交签名成功',
                type: 'success',
                duration: 1500
              })
              this.getProjectArchivesInfo(this.projectInfo.projectNo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 提交签名数据至数据库
      commitProjectAuthData () {
        var urlStr = ''
        if (this.canCommitFlag == 'save') {
          urlStr = '/project/projectarchives/save'
        } else {
          urlStr = '/project/projectarchives/update'
        }
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(urlStr),
            method: 'post',
            data: this.$http.adornData({
              projectNo: this.dataForm.projectNo,
              projectName: this.dataForm.projectName,
              sigImage: this.dataForm.sigImage,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },

    }
  }
</script>

<style lang="less">
  .site-bottom {
    position: fixed;
    width: 100%;
    bottom: 0px;
    z-index: 0;
    background-color: #a9b7bb;
    color: whitesmoke;
    padding: 1px;
  }

  .site-bottom a {
    color: whitesmoke;
  }

  .box {
    margin: 20px auto;
    span{
      margin-left: 10px;
    }
  }
  .boardBox {
    margin: 0px auto;
    width: 90vw;
    height: 25vh;
    border: 1px solid #c7bdbd;
  }

  .line_pro {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 700;
    span {
      color: blue;
      font-weight: 500;
    }
  }
  .sig_canvas {
    width: 100%;
    border: 1px solid #c7bdbd;
  }
  .main-navbar {
    width: 100%;
    background-color: #667AFA;
    min-height: 47px;
    text-align: center;
    vertical-align: middle;
    padding: 13px;
    color: white;
    font-weight: 700;
    font-size: 13pt;
  }

</style>
