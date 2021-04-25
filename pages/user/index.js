// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    collectNums: 0   // 收藏的商品数量
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取缓存中的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    // 获取缓存中的收藏商品
    const collect = wx.getStorageSync('collect') || [];
    this.setData({
      userInfo,
      collectNums: collect.length
    })
  }
})