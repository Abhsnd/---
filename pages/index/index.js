import {request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 分类导航数组
    catesList: [],
    // 楼层数组
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList();
    this.getcatesList();
    this.getfloorList();
  },

  // 获取轮播图数据
  getSwiperList() {
    request({url: '/home/swiperdata'})
    .then(result=>{  
      this.setData({
        swiperList: result
      })
    })
  },

  // 获取分类导航数据
  getcatesList() {
    request({url: '/home/catitems'})
    .then(result=>{
      this.setData({
        catesList: result
      })
    })
  },

  // 获取楼层数据
  getfloorList() {
    request({url: '/home/floordata'})
    .then(result=>{
      this.setData({
        floorList: result
      })
    })
  }
})