// pages/login/index.js
Page({
  // 登录事件
  handlegetUserInfo(e) {
    const {userInfo} = e.detail;
    wx.setStorageSync('userInfo', userInfo);
    wx.navigateBack({
      delta: 1,
    })
  }  
})