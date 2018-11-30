// pages/search/index.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: null,

    keyword: "",
    searchtextfocus: true,

    history: [],
    random: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomData()
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
    var that = this

    // 设置城市
    this.setData({
      city: app.globalData.city,
    })

    // 获取历史关键字
    wx.getStorage({
      key: 'keyword_history',
      success: function(res) {
        if (res.data) {
          that.setData({
            history: res.data,
          })
        }
      },
    })
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
  deleteSearcch(){
    this.setData({ keyword : ''})
    wx.navigateBack({})
  },
  getRandomData: function() {
    wx.showNavigationBarLoading()
    wx.request({
      url: `${app.globalData.baseUrl}/tool/hot`,
      method: 'GET',
      dataType: 'json',
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
            console.log(res.data)
          this.setData({ random : res.data.data.data})
        }
      },
      complete: function() {
        wx.hideNavigationBarLoading()
      },
    })
  },

  // 删除关键字
  deleteHistory: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否清空历史关键字',
      success: function(e) {
        if (e.confirm) {
          that.setData({
            history: [],
          })

          wx.setStorage({
            key: 'keyword_history',
            data: [],
          })
        }
      },
    })
  },

  // 选择关键字
  onSelectKeyword: function(e) {
    this.gotoSearch(e.target.dataset.tag)
  },

  // 搜索
  tappedSearch: function(e) {
    console.log(e)
    var keyword = e.detail.value || ''

    if (keyword) {
      var history = this.data.history || []
      if (history.indexOf(keyword) < 0) {
        history.push(keyword)
        // 保存关键字
        wx.setStorage({
          key: 'keyword_history',
          data: history,
        })
      }
    }

    this.gotoSearch(keyword)
  },

  // 到搜索结果页
  gotoSearch: function(keyword) {
    wx.navigateTo({
      url: '/pages/search-result/index?keyword=' + keyword,
    })
  },

  gotoCity: function() {
    wx.navigateTo({
      url: '/pages/city/index',
    })
  },
})