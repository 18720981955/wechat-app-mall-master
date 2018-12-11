// pages/authorize/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      console.log("BBB")
      return;
    }
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      console.log("AAAA")
      this.login();
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  login: function () {
    let that = this;
    let token = wx.getStorageSync('token');
    console.log("CCC")
    console.log("TOKEN" + token)
    if (token) {
      wx.request({
        url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/check-token',
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            wx.removeStorageSync('token')
            that.login();
          } else {
            // 回到原来的地方放
            wx.navigateBack();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        console.log(res.code)
        wx.request({
          url: 'http://localhost:8080/wx/user/wxf41e40d815bd29fe/login',
          data: {
            code: res.code
          },
          success: function (res) {
            var openid = res.data.openid
            var sessionKey = res.data.sessionKey
            if (res.data.openid) {
              // 去注册
              that.registerUser(openid, sessionKey);
              return;
            }
            if (res.data.code != 0) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            wx.setStorageSync('token', res.data.data.token)
            wx.setStorageSync('uid', res.data.data.uid)
            // 回到原来的地方放
            wx.navigateBack();
          }
        })
      }
    })
  },
  registerUser: function (openid, sessionKey) {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到      console.log('resnew':code)
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            var signature = res.signature;
            var rawData = res.rawData;
            // 下面开始调用注册接口
            wx.request({
              url: 'http://localhost:8080/wx/user/wxf41e40d815bd29fe/info',
              //到数据库里面插入数据openid
              //逻辑在这里全部写完
              data: { sessionKey: sessionKey, signature: signature, rawData: rawData, encryptedData: encryptedData, iv: iv },
              // 设置请求的 参数
              success: (res) => {
                /*wx.request({
                  url: 'http://localhost:8080/wx/user/select',
                  data: {"openId" : res.data.openId},
                  success: (res) => {
                    console.log('qwer:' + JSON.stringify(res))
                  }
                })*/
                console.log('rwqeqweqw2es:' + JSON.stringify(res))
                console.log('tokenssawsaw:')
                wx.hideLoading();
               // that.login();
              }
            })
          }
        })
      }
    })
  }
  
})