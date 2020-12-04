const app = getApp()
const apikey = 'LzukUGJYLve33xrVDLE64nOftgI='
const deviceid = '653805437'
var temp=1;
var deviceConnected = false
const deviceInfoURL = "https://api.heclouds.com/devices/" + deviceid
const getDataStreamURL = "https://api.heclouds.com/devices/" + deviceid + "/datastreams"
const sendCommandURL = "https://api.heclouds.com/cmds"
var led = 0
function getDeviceInfo(that) {
  //查看设备连接状态，并刷新按钮状态
  wx.request({
    url: deviceInfoURL,
  method:"GET",
    header: {
      'content-type': 'application/json',
      "api-key": apikey,
      "topic":"niu"
    },
    data: {

    },
    success(res) {
    //console.log(res)
      if (res.data.data.online) {
        console.log("设备已经连接")
        that.setData({ statement:"设备已经连接" })
        deviceConnected = true
      } else {
        console.log("设备还未连接")
        that.setData({ statement:"设备还未连接" })
        deviceConnected = false
      }
    },
    fail(res) {
      console.log("请求失败")
      deviceConnected = false
    },
    complete() {
      if (deviceConnected) {
        that.setData({ deviceConnected: true })
      } else {
        that.setData({ deviceConnected: false })
      }
    }
  })
}
function deviceInit(that) {
  console.log("开始初始化按钮")
  //初始化各个硬件的状态
  wx.request({
    url: getDataStreamURL,
    header: {
      'content-type': 'application/json',
      "api-key": apikey,
    },
    data: {
    },
    success(res) {
        var info = res.data.data[0]       
        if(info.current_value == 1) {
          that.setData({ led_checked : true})
        } else {
          that.setData({ led_checked : ''})
        }
    }
  })
}
function controlLED(hardware_id ,switch_value) {
  // console.log("发送命令：" + hardware_id + ":{" + switch_value + "}")
  console.log("发送命令：" + hardware_id + ":" +switch_value )
  //按钮发送命令控制硬件
  wx.request({
    url: sendCommandURL + "?device_id=" + deviceid,
    method: 'POST',
    header: {
      'content-type': 'application/json',
      "api-key": apikey
    },
    // data: hardware_id + ":{" + switch_value + "}",//TODO 设计自定义语言 blueled:{V}, 预感这边可能会有问题
    data: hardware_id + ":" + switch_value,
    success(res) {
      console.log("控制成功")
      console.log(res)
     console.log(res.data);
     wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000,
      mask:true
  })
    },
    fail(){}
  })
}
Page({
  data:{
    led_checked:true,
    statement:"设备未连接"
  },
  onLoad: function () {
    //加载时完成1.检查设备是否连接2.连接成功将数据显示在界面
    var that = this //将当前对象赋值
    getDeviceInfo(that)
    temp=1
  },
  onShow: function() {
    //TODO依旧有问题
    var that = this
    var timer = setInterval(function(){
      getDeviceInfo(that)
    }, 3000)
  },
  change: function (event) {
    var cmdData = event.detail.value//修改为约定的数据
    if(cmdData==1)
    {
      led=1;
      controlLED("switch0",1);
    }
    else  
    {
      led=0;
      controlLED("switch0",0);
    }
  },

})