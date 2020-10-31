<template>
  <div>
    <qrcodeModule :qrcodeName="qcName" :qrcodeText="qcText"/>
  </div>
</template>

<script>
  import qrcodeModule from '@/components/qrcode-module'
  export default {
    data () {
      return {
        qcName:'百度二维码',
        qcText:'https://www.baidu.com'
      }
    },
    components: {
      qrcodeModule
    },
  }
</script>



