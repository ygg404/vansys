import axios from '../plugins/axios'
import api from "../config/api.js";
export default function wxConfig () {
  axios({
    url: api.GetJssdkConfig,//接口地址
    method: 'post',
    data: {
      url: window.location.href.split('#')[0],
    }
  }).then(res => {
    if (res.data.state == 1) {
      wx.config({
        debug: false,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.data.data.appId,// 必填，公众号的唯一标识
        timestamp: res.data.data.timestamp,// 必填，公众号的唯一标识
        nonceStr: res.data.data.nonceStr,// 必填，生成签名的随机串
        signature: res.data.data.signature,// 必填，签名
        jsApiList: ["scanQRCode"]// 必填，需要使用的JS接口列表
      })
      wx.error(err => console.log(err))
      wx.ready(() => {
        wx.checkJsApi({
          jsApiList: ["scanQRCode"],
          success: res => {
            console.log(res);
            if (res.checkResult.indexOf("scanQRCode") != -1) {
              console.log("1");
            }
          }
        });
      });
    }
  })
}
