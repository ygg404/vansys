<template>
  <!--二维码Demo-->
  <div>
    <!--<van-button ref="download" :href="downloadUrl" @click="download">download</van-button>-->
    <!--<div ref="codeTopic" v-if="isPic">-->
    <div ref="codeTopic" class="qrCodeImgStyle">
      <div id="qrCode" ref="qrCodeDiv"></div>
      <div class="qrcodeTextStyle">{{qrcodeName}}</div>
    </div>
    <!--<div v-else>-->
      <!--<a ref="download"  :href="canvasImageUrl" ></a>-->
    <!--</div>-->
    <van-button @click="saveQrCodeBtn">保存二维码</van-button>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import html2canvas from 'html2canvas'
  export default {
    props: ['qrcodeName','qrcodeText'],
    data () {
      return {
        downloadUrl:'www.baidu.com',
        // isPic:true,
        canvasImageUrl:''
      }
    },
    methods: {
      downqcrodePic() {
        let imgData = this.canvasImageUrl
        let timestamp = new Date().getTime()
        let name = this.canvasImageUrl.substring(22, 30) + timestamp + '.png'
        this.downloadFile(name, imgData);
      },
      //下载
      downloadFile(fileName, content) {
        let aLink = document.createElement('a');
        let blob = this.base64ToBlob(content); //new Blob([content]);

        let evt = document.createEvent("HTMLEvents");
        console.log("点击下载",evt)
        evt.initEvent("click", true, true);
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.click()
      },
      //base64转blob
      base64ToBlob(code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {type: contentType});
      },

      htmlToCanvas() {
        html2canvas(this.$refs.codeTopic, {})
          .then((canvas) => {
            let imageUrl = canvas.toDataURL('image/png'); // 将canvas转成base64图片格式
            this.canvasImageUrl = imageUrl;
            this.downqcrodePic();
            // this.isDom = false;
          });
      },
      saveQrCodeBtn(){
        const that = this
        that.htmlToCanvas();
      }
    },
    mounted() {
      new QRCode(this.$refs.qrCodeDiv, {
        text: this.qrcodeText,
        render: "canvas",
        width: 200,
        height: 200,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
        correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
      });
    }


  }
</script>

<style>
  .qrcodeTextStyle{
    font-size:18px;font-weight:700;width:200px;
  }
  .qrCodeImgStyle{
    width:300px;text-align:center;
    margin-left: 100px;
    margin-top: 10px;
  }

</style>



