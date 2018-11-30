// pages/user/index.js
const { $Message } = require('../../iview/base/index');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.user) {
      // this.refreshUserData()
    } else {
      // if (wx.getStorageSync('userData')){
        // this.setData({ user: wx.getStorageSync('userData') })
      // }else{
        this.setData({ user: app.globalData.userInfo })
      // }
      
      
    }
  },


  // 授权回调操作
  toLogin: function(res) {
    // var user = {
    //   nickname: 'anlinsir',
    //   avatar: '1',
    //   token: 'fsfdgdgfhfik',
    // }
    // // 设置登录数据
    // app.setUserInfo(user)
    // this.setData({ user: user })
    // return
    if (!res.detail.userInfo) return

    var that = this
    wx.showNavigationBarLoading()
    wx.login({
      success: function(e) {
        if (e.code) {
          console.log(e.code)
          console.log(res)
          wx.showLoading({
            title: '登录中',
            success: () => {
              wx.getUserInfo({
                withCredentials:true,
                success:()=>{
                  wx.request({
                    url: `${app.globalData.commomUrl}/account/proLogin`,
                    method: 'POST',
                    data: {
                      // nickname: res.detail.userInfo.nickName,
                      // thumb: res.detail.userInfo.avatarUrl,
                      code: e.code,
                      iv: res.detail.iv,
                      encryptedData: res.detail.encryptedData,
                      pro_name:'used'
                    },
                    dataType: 'json',
                    success: rsp => {
                      if (rsp.statusCode == 200) {
                          console.log(rsp.data.code)
                        if (rsp.data.code == app.globalData.successCode) {
                          // 提示
                          $Message({content: '登录成功', type: 'success'});
                          var user = {
                            nickname: rsp.data.data.nickname,
                            avatar: rsp.data.data.thumb,
                            token: rsp.data.data.token,
                          }
                          // 设置登录数据
                          app.setUserInfo(user)
                          wx.setStorageSync('userData', user);
                          that.setData({ user: user })
                        } else if(rsp.data.code == 404) {
                          // $Message({
                          //   content: rsp.data.msg,
                          // })
                            wx.showModal({
                              title: '提示',
                              content: '请先绑定手机号',
                              showCancel: true,
                              confirmText: '去绑定',
                              cancelText: '关闭',
                              success: function (e) {
                                wx.setStorageSync('loginData', rsp.data.data);
                                if (e.confirm) {
                                  wx.navigateTo({
                                    url: '/pages/bind/index',
                                  })
                                }
                              },
                            })
                        }else{
                          $Message({content: '授权失败，请重试', type: 'error'});
                        }
                      }
                    },
                    complete: function () {
                      wx.hideLoading()
                    }
                  })
                }
              })
            }
          })

        } else {
          // 授权失败
          $Message({
            content: '授权失败，请重试',
            type: 'error'
          });
        }
      },
      fail: function(e) {
        // 请求失败
        $Message({
          content: e,
          type: 'error'
        });
      },
      complete: function(e) {
        wx.hideNavigationBarLoading()
      }
    })
  },

  // 退出登录
  toLogout: function() {
    var that = this
     wx.showModal({
       title: '退出',
       content: '确认要退出登录',
       confirmText: '退出',
       success: function(e) {
         if (e.confirm) {
           app.removeUserInfo()
           that.setData({ user: null })
           wx.getStorageSync('userData',null)
           wx.removeStorageSync('userData')
         } else if (e.cancel) {
          //  
         }
       },
     })
  },

  // 到我的发布页
  gotoMinePublish: function() {
    if (this.data.user) {
      wx.navigateTo({
        url: '/pages/minepublish/index',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '我知道了',
        showCancel: false,
      })
    }
  },

  // 到我的收藏页
  gotoMineLiked: function() {
    if (this.data.user) {
      wx.navigateTo({
        url: '/pages/mineliked/index',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '我知道了',
        showCancel: false,
      })
    }
  },

  // 到意见反馈
  gotoFeedback: function() {
    if (this.data.user) {
      wx.navigateTo({
        url: '/pages/feedback/index',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '我知道了',
        showCancel: false,
      })
    }
  },

  gotoAd: function() {
    wx.showModal({
      title: '提示',
      content: '敬请期待',
      confirmText: '我知道了',
      showCancel: false,
    })
  },
})