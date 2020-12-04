const app = getApp()
Page({
  data: {
    username: '',
    password: ''
  },
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  login: function () {
    var that = this;
    if (this.data.username.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if(this.data.username=="503"&&this.data.password== "12345678"){
      wx.navigateTo({  
        url:"/pages/index/index"
   })
    }
  },
})
 