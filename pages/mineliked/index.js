// pages/minepublish/index.js
const { $Message } = require('../../iview/base/index');

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,

    isLoad: false,
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getItems(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getItems(1, true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.isLoad) return
    this.setData({ items: [] })
    this.getItems(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad) return
    this.getItems(this.data.page + 1)
  },

  // 到职位详情页面
  onDetailed: function (e) {
    var id = e.target.dataset.id || null;
    wx.navigateTo({
      url: `/pages/position/index?id=${id}`,
    })
  },

  // 获取数据列表
  getItems: function (page, isCover) {
    // 是否覆盖
    isCover = isCover || false

    this.setData({ isLoad: true })
    wx.showNavigationBarLoading()

    wx.request({
      url: `${app.globalData.baseUrl}/account/collects`,
      method: 'POST',
      dataType: 'json',
      header: {
        token: app.globalData.userInfo.token,
      },
      data: {
        page: page,
      },
      success: (res) => {
        // console.log(res)
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          // 覆盖
          if (isCover) {
            this.setData({ items: res.data.data, page: page, })
            return;
          }
          // 数量大于0
          if (res.data.data.length > 0) {
            this.setData({
              items: this.data.items.concat(res.data.data),
              page: page,
            })
          } else if (page == 1){
            $Message({
              content: '没有发现任何收藏项目',
              type: 'warning'
            });
          }
        } else {
          $Message({
            content: res.data.msg || '服务器出现故障',
            type: 'error'
          });
        }
      },
      fail: function (e) {

      },
      complete: e => {
        // 加载完成
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        this.setData({
          isLoad: false,
        })
      },
    })
  },
})