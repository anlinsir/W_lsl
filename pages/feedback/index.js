// pages/feedback/index.js
const { $Message } = require('../../iview/base/index');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: `${app.globalData.baseUrl}/account/replyMsg`,
      header: {token: app.globalData.userInfo.token},
      method: 'GET',
      dataType: 'json',
      success: function(e) {
        if (e.statusCode == 200 && e.data.code == app.globalData.successCode) {
          if (e.data.data) {
            wx.showModal({
              title: '上次反馈答复',
              content: e.data.data.content,
              showCancel: false,
            })
          }
        }
      },
    })
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  onFeedbackInput: function(e) {
    this.setData({
      content: e.detail.value,
    })
  },


  onSend: function() {
    var content = this.data.content
    if (!content) {
      return $Message({content: '请输入反馈内容',type: 'error'})
    }

    wx.showLoading({
      title: '提交中',
      mask: true,
      success: e => {
        wx.request({
          url: `${app.globalData.baseUrl}/account/callBack`,
          method: 'POST',
          dataType: 'json',
          header: {token: app.globalData.userInfo.token},
          data: { content: content },
          success: res => {
            if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
              console.log(res)
              wx.redirectTo({
                url: '/pages/feedback/done',
              })
            } else {
              wx.hideLoading()
              $Message({ 
                content: res.data.msg || '服务器故障，请重试！~', 
                type: 'error',
              })
            }
          },
          complete: function () {
            // 
          }
        })
      }
    })
  },
})