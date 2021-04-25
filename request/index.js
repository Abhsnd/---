// 同时发送异步代码的次数
let ajaxTimes = 0;

export const request = (params) => {
  // 判断 url中是否带有 /my/ 请求 这是私有的路径 需要带上header token
  let header = { ...params.header };
  // 如果url包含'/my/'，则拼接
  if (params.url.includes("/my/")) {
    // 拼接header 带上token
    header["Authorization"] = wx.getStorageSync("token");
  }

  ajaxTimes++;
  // 显示"加载中"效果
  wx.showLoading({
    title: '加载中',
    mask: true,
  })

  // 定义公共url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading();   // 关闭正在等待的图标
        }
      }
    })
  })
}