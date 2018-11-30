//index.js
const { $Message } = require('../../iview/base/index')

//获取应用实例
const app = getApp();

Page({
  data: {
    tel: "",
    auth_code: "",
    data: "",
    time: 0,
    timeNum: 0,
    errorMsg: ""
  },

  onLoad: function (options) {
    var tel = options.tel;
    this.setData({
      data: wx.getStorageSync('loginData'),
      tel: tel
    })
    // wx.removeStorageSync('loginData');
    this.getCode();
  },
  onShow: function () {

  },
  //开始倒计时
  startTime: function () {
    var num = setInterval(this.timeCallback, 1000);
    this.setData({
      timeNum: num,
      time: 60
    });
  },
  //倒计时回调函数
  timeCallback: function () {
    var time = this.data.time;
    if (time == 0) {
      clearInterval(this.data.timeNum);
      return false;
    }
    this.setData({
      'time': time - 1
    });
  },
  getCode: function () {
    var that = this;
    wx.showLoading({
      title: "短信发送中",
      mask: true
    });
    wx.request({
      url: 'http://52.81.24.111:8088/tool/sendSMS',
      method: "POST",
      data: { "tel": that.data.tel },
      success: function (rps) {
        if (rps.data.code == 200) {
          $Message({
            content: '发送成功',
            type: 'success'
          });
          that.startTime();
        } else {
          $Message({
            content: '发送失败',
            type: 'error'
          });
        }
      },
      fail: function () {
        $Message({
          content: '发送失败',
          type: 'error'
        });
      },
      complete: function () {
        wx.hideLoading();
      },
    });
  },
  onChangeCode: function (e) {
    var code = e.detail.value;
    this.setData({
      'auth_code': code
    })
    if (code.length == 6)
      this.bindTel();
  },
  bindTel: function () {
    if (this.data.auth_code == "" || this.data.tel == "") {
      $Message({
        content: '请填入电话号码和验证码',
        type: 'warning'
      });
      return
    }
    if (this.data.data == "") {
      $Message({
        content: '服务器开小差了',
        type: 'error'
      });
      return
    }
    var data = {};
    data.tel = this.data.tel;
    data.pro_name = "used";
    data.auth_code = this.data.auth_code;
    data.unionId = this.data.data.unionId;
    data.openId = this.data.data.openId;
    data.thumb = this.data.data.thumb;
    data.nickname = this.data.data.nickname;
    data.key = this.data.data.key;
    data.type = 1;
    wx.showLoading({
      title: "绑定中",
      mask: true
    });
    var that = this
    wx.request({
      url: app.globalData.commomUrl + "/account/bind",
      method: "POST",
      data: data,
      success: function (rps) {
        if (rps.data.code == 200) {
          rps.data.data.avatar = rps.data.data.thumb;
          app.setUserInfo(rps.data.data);
          wx.showModal({
            title: '成功',
            content: '绑定成功',
            confirmText: '确定',
            success: function (e) {
              if (e.confirm) {
                wx.navigateBack({
                  delta: 3
                });
              }
            },
          })
        } else if (rps.data.code == 202) {
          rps.data.data.avatar = rps.data.data.thumb;
          app.setUserInfo(rps.data.data);
          wx.showModal({
            title: '成功',
            content: '绑定成功,您的初始密码为' + rps.data.data.pwd,
            confirmText: '确定',
            success: function (e) {
              if (e.confirm) {
                wx.navigateBack({
                  delta: 3
                });
              }
            },
          })
        } else {
          $Message({
            content: rps.data.msg,
            type: 'error'
          });
          that.setData({
            'errorMsg': rps.data.msg
          });
        }
      },
      fail: function () {
        $Message({
          content: '绑定失败',
          type: 'error'
        });
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  }
})
