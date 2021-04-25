// pages/category/index.js
import {request} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数组
    leftMenuList: [],
    // 右侧商品数组
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCates();
    // 获取本地存储数据
    const Cates = wx.getStorageSync('cates');
    if (!Cates) {
      this.getCates();  // 不存在则发送请求获取数据
    } else {  // 存在旧数据
      if (Date.now()-Cates.time > 1000*300) {    // 旧数据超时,超时时间5分钟
        this.getCates();
      } else {    // 旧数据未超时
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        }) 
      }
    }
  },

  // 获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // })
    // .then(res=>{
    //   this.Cates = res.data.message;
    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync('cates', {time:Date.now(), data:this.Cates})
    //   // 构造左侧的菜单数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    // 使用ES7的async await来发送请求
    const res = await request({url: "/categories"});
    this.Cates = res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync('cates', {time:Date.now(), data:this.Cates})
    // 构造左侧的菜单数据
    let leftMenuList = this.Cates.map(v=>v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 左侧菜单点击事件
  handItemTap(e) {
    const {index} = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0   // 重置右侧滚动条顶部距离
    })
  }
})