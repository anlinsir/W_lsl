// pages/city/index.js

const { citys } = require('../../utils/util.js');

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: null,

    hotlist: [],

    cityIndex: [0, 0, 0],
    cities: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取城市
    citys.getData({
      type: 1,
      success: data => {
        this.setData({
          cities: data,
          city: app.globalData.city,
          cityIndex: app.globalData.city.index || [0, 0, 0],
        })
      
        // 从原来选择的城市更新列表
      }
    })

    wx.request({
      url: `${app.globalData.baseUrl}/tool/hotCity`,
      method: 'GET',
      dataType: 'json',
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          this.setData({hotlist: res.data.data})
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  onPullDownRefresh: function(e) {
    // 获取城市
    citys.getData({
      type: 1,
      success: data => {
        this.setData({ cities: data })
        wx.stopPullDownRefresh()
      }
    })
  },

  onChangeCity: function (e) {
    var index = e.target.dataset.index || 0
    var value = e.target.dataset.value || 0
    // 改变
    var cityIndex = this.data.cityIndex
    cityIndex[index] = value

    // 下级索引修改
    if (index == 0) {
      cityIndex[1] = cityIndex[2] = 0
    } else if (index == 1) {
      cityIndex[2] = 0
    }
    // 渲染
    this.setData({ cityIndex: cityIndex})

    var city = this.getCitysByIndex(cityIndex, this.data.cities)
    app.setCityData(city)
    // 如果选择的第三级或者第一个
    if (value == 0 || index == 2) {
      wx.navigateBack({})
      console.log(app.globalData.city)
    }
  },

  // 获取city
  getCitysByIndex: function (indexs, cities) {
    var a = cities[indexs[0]]
    var b = a && a.children && a.children[indexs[1]] || null
    var c = b && b.children && b.children[indexs[2]] || null

    return {a: a, b: b, c: c, index: indexs}
  },

  // 选择当前
  selectCurrent: function() {
    app.setCityData(this.data.city)
    wx.navigateBack()
  },

  // 选择热门城市
  onSelectHotlist: function(e) {
    // console.log(e)
    app.setCityData(this.data.hotlist[e.target.dataset.index])
    wx.navigateBack()
  },
})