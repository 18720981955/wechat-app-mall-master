// pages/authorize/index.js
import route from '../../utils/route'
var app = getApp();
const API = 'http://localhost:8080/'

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
      return;
    }
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
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
    console.log("comming")
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
              return ;
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
                //console.log('res:' + JSON.stringify(res))
                if (res.data.code == 0) {
                  console.log(res)
                  wx.setStorageSync('userInfo', res.data.userInfo)
                  wx.setStorageSync('token', res.data.token)
                  // 登录成功
                  wx.hideLoading();
                  //wx.setStorageSync('tokensw', res.data.data.token)
                  //wx.setStorageSync('uid', res.data.data.uid)
                  // 回到原来的地方放
                  wx.navigateTo({
                    url: "/pages/start/start"
                  })
                  return
                }
                else{
                    // 登录错误
                    wx.hideLoading();
                    wx.showModal({
                      title: '提示',
                      content: '无法登陆，请联系商家',
                      showCancel: false
                    })
                    return;
                  }
              }
            })
          }
        })
      }
      })
  }
})