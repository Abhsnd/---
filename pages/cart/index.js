// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    isallChecked: false,   // 是否全部选中
    totalPrice: 0,   // 总价格
    totalNum: 0  // 总数量
  },

  onShow() {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || [];
    this.setData({ address });
    this.setCart(cart);
  },

  // 点击 收货地址
  async handleChooseAddress() {
    try {
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断权限状态
      if (scopeAddress === false) {
        // 打开授权页面
        await openSetting();
      }
      // 获取收货地址
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 存入缓存中
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);
    }
  },

  // 商品选中
  handeItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].ischecked = !cart[index].ischecked;
    // 设置购物车
    this.setCart(cart);
  },

  // 设置购物车状态
  setCart(cart) {
    // 计算全选
    let isallChecked = true;
    // 计算总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.ischecked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        isallChecked = false;
      }
    })
    // 判断数组是否为空
    isallChecked = cart.length != 0 ? isallChecked : false;
    // 给data赋值
    this.setData({
      cart,
      isallChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },

  // 商品全选
  handleItemAllCheck() {
    // 获取data中的数据
    let { cart, isallChecked } = this.data;
    // 修改值取反
    isallChecked = !isallChecked;
    // 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.ischecked = isallChecked);
    // 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },

  // 商品数量编辑
  async handleItemNumEdit(e) {
    // 获取传递过来的参数 
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 进行修改数量
      cart[index].num += operation;
      // 设置回缓存和data中
      this.setCart(cart);
    }
  },

  // 点击结算
  async handlePay() {
    // 判断收货地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }
    // 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }


})