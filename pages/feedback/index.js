// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      }, {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    chooseImgs: [],   // 被选中的图片路径数组
    textVal: ""    // 文本域的内容
  },
  UpLoadImgs: [],    // 外网图片的路径数组

  // 标题点击事件
  handletabsItemChange(e) {
    // 获取被点击的标题索引
    const { index } = e.detail;
    // 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },

  // 点击"+"号选择图片
  handleChooseImg() {
    // 调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式  原图  压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源  相册  照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
    })
  },

  // 点击自定义图片组件 删除图片
  handleRemoveImg(e) {
    // 获取被点击的组件的索引
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },

  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  // 点击提交按钮
  handleFormSubmit() {
    // 获取文本域的内容 图片数组
    const { textVal, chooseImgs } = this.data;
    // 检查合法性
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }
    // 准备上传图片到专门的图片服务器
    // 显示正在等待的提示
    wx.showLoading({
      title: '正在上传中',
      mask: true,
    });
    // 判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      // 有图片需要上传
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 被上传文件的路径
          filePath: v,
          // 上传的文件名字
          name: 'file',
          // 文件上传的目标位置
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result);
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组 提交到后台中");
            }
            // 提交成功,重置页面
            this.setData({
              textVal: "",
              chooseImgs: []
            })
            // 返回上一页面
            wx.navigateBack({
              delta: 1
            })
          }
        })
      })
    } else {
      // 没有图片需要上传
      wx.hideLoading();
      console.log("只提交了文本");
      // 返回上一页面
      wx.navigateBack({
        delta: 1
      })
    }
  }

})