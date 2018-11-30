//index.js
const { $Message } = require('../../iview/base/index')

//获取应用实例
const app = getApp();

Page({
  data: {
    countries: [],
    isShow: false,
  },

  onLoad: function () {
    wx.showLoading({
      title: '定位中',
    });
    var countries = wx.getStorageSync('countries');
    var that = this;
    if (!countries) { //获取区号信息
      wx.request({
        url: 'http://52.81.24.111:8088/tool/countryCode',
        method: "POST",
        success: function (res) {
          that.setData({ "countries": res.data.data });
          wx.setStorageSync('countries', res.data.data);
        },
        complete: function () {
          that.locationAndMatch();
        }
      });
    } else {
      this.setData({ "countries": countries });
      this.locationAndMatch();
    }
  },

  onShow: function () {

  },

  //定位并匹配国家
  locationAndMatch: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        var lat = res.latitude;
        var lng = res.longitude;
        var c = that.data.countries;
        for (var i in c) {
          if (c[i]['lat_start'] <= lat && c[i]['lat_end'] >= lat & c[i]['lng_start'] <= lng && c[i]['lng_end'] >= lng) {
            var country = c[i];
            c.splice(i, 1);
            c.unshift(country);
            that.setData({ 'countries': c });
            wx.setStorageSync('countries', c);
          }
        }

      },
      complete: function () {
        wx.hideLoading();
      },
    });
  },

  //选择国家
  onChangeCountry: function (e) {
    var c = this.data.countries;
    var i = e.currentTarget.dataset.index;
    var country = c[i];
    c.splice(i, 1);
    c.unshift(country);
    this.setData({
      'countries': c,
      'isShow': false
    });
    wx.setStorageSync('countries', c);
  },

  //开启或关闭选择框
  onChangeShow: function () {
    var isShow = this.data.isShow ? false : true;
    this.setData({ "isShow": isShow });
  },

  //去输入电话号码页面
  goToCA: function () {
    wx.navigateTo({
      url: '/pages/bind/ca',
    })
  }
})
