// 指定服务器接口

const API = 'http://localhost:8080/'

const checkToken = (cmd, params) => {
  wx.showToast({
    title: '数据加载中...',
    icon: 'loading',
    duration: 2000
  })
  wx.request({
    url: API + (cmd ? ('/' + cmd) : ''),
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": params,
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
};
const login = (cmd, params) => {
  wx.showToast({
    title: '数据加载中...',
    icon: 'loading',
    duration: 2000
  })
  wx.request({
    url: API + (cmd ? ('/' + cmd) : ''),
    data: params,
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
      //wx.setStorageSync('token', res.data.data.token)
      //wx.setStorageSync('uid', res.data.data.uid)
      // 回到原来的地方放
      wx.navigateBack();
    }
  })
}
export default {
  checkToken : checkToken,
  login : login
}