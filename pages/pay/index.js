// pages/pay/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.ischecked);
    this.setData({ address });
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  // 点击 支付 
  async handleOrderPay() {
    try {
      // 获取缓存中的token 
      const token = wx.getStorageSync("token");
      // 判断缓存中是否存在token，不存在跳转到授权页面
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      // 创建订单
      // 准备 请求头参数
      // const header = { Authorization: token };
      // 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods };
      // 准备发送请求 创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      // 发起 预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      // 发起微信支付 
      await requestPayment(pay);
      // 查询后台 订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
      // 支付成功弹窗提示
      await showToast({ title: "支付成功" });
      // 删除缓存中已经支付的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.ischecked);
      wx.setStorageSync("cart", newCart);
      // 支付成功 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error);
    }
  }
})