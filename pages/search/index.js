// pages/search/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    inpValue: "",     // 输入框的值
    isFocus: false    // 是否显示取消按钮
  },
  TimeId: -1,  // 计时器秒数

  // 输入框的值改变 触发事件
  handleInput(e) {
    // 获取输入框的值
    const { value } = e.detail;
    // 2 检查合法性
    if (!value.trim()) {
      // 值不合法
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    // 准备发送请求获取数据
    this.setData({
      isFocus: true
    })
    // 清除计时器
    clearTimeout(this.TimeId);
    // 设置计时器，1秒后发送请求
    this.TimeId = setTimeout(() => {
      this.getQsearch(value);
    }, 1000);
  },

  // 发送请求获取搜索建议 数据
  async getQsearch(query) {
    const goods = await request({ url: "/goods/qsearch", data: { query } });
    this.setData({
      goods
    })
  },

  // 点击取消按钮
  handleCancel() {
    this.setData({
      inpValue: "",
      goods: [],
      isFocus: false
    })
  }

})