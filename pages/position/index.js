// pages/position/index.js
const { $Message } = require('../../iview/base/index');

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharebox: false,

    // 
    id: null,
    item: null,
    images: [],
    imageIndex: 0,
    play:false,
    video:'',
  },
  TaPublish(){//ta的发布页面
    wx.navigateTo({
      url: '/pages/otherPublish/index?id=' + this.data.item.account_id
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    var id = parseInt(options.id) || null
    if (id == null) {
      id = parseInt(decodeURIComponent(options.scene)) || null
    }
  
    if (id == null) {
      wx.showModal({
        title: '故障',
        content: '页面参数加载错误',
        showCancel: false,
        success: e => {
          if (e.confirm) {
            wx.navigateBack()
          }
        }
      })
    } else {
      this.setData({ id: id })
      // 加载数据
      this.getItem()
    }
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
    // this.getItem()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  playVideo: function (e) {
    var index = e.currentTarget.dataset.index;
    var video = e.currentTarget.dataset.video;
    this.setData({
        play: true,
        video: video,
    });
},
stopPlay: function () {
  this.setData({
      play: false
  });
},

  // 获取数据
  getItem: function() {
    wx.showNavigationBarLoading()

    wx.request({
      url: `${app.globalData.baseUrl}/used/detail`,
      method: 'POST',
      dataType: 'json',
      header: {
        token: app.globalData.userInfo && app.globalData.userInfo.token || '',
      },
      data: {
        id: this.data.id
      },
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          var images = []
          // for (var i in res.data.data.images) {
          //   images.push(res.data.data.images[i].image)
          // }
          this.setData({
            item: res.data.data,
            images: res.data.data.images[0].image,
          })
        } else {
          $Message({
            content: res.data.msg || '服务器错误',
            type: 'warning',
          })
        }
      },
      fail: function (e) {
        // 
      },
      complete: e => {
        wx.hideNavigationBarLoading()
      },
    })
  },

  // 预览图片
  onPreviewImage: function(e) {
    var current = e.currentTarget.dataset.path
    wx.previewImage({
      urls: this.data.images,
      current: current,
    })
  },

  // 打开分享框
  onShare: function() {
    this.setData({ sharebox: true })
  },

  // 关闭分享框
  shareCancel: function() {
    this.setData({ sharebox: false });
  },

  // 生成长图
  onCreateLongImage: function() {
    var that = this

    wx.showLoading({
      title: '生成中',
      mask: true,
      success: function() {
        wx.request({
          url: `${app.globalData.baseUrl}/tool/drawing`,
          data: {id: that.data.item.id},
          method: 'POST',
          dataType: 'json',
          success: res => {
            if (res.statusCode == 200 && res.data.code == 200) {
              wx.previewImage({
                urls: [res.data.data.img],
              })
            } else {
              $Message({
                content: res.data.msg || '服务器错误',
                type: 'warning',
              })
            }
          },
          complete: function() {
            wx.hideLoading()
          }
        })
      }
    })
  },

  // 立即联系
  toCall: function() {
    // 需要登录?
    if (!app.globalData.userInfo) {
      return wx.showModal({
        title: '提示',
        content: '请登录后再进行操作',
        showCancel: true,
        confirmText: '去登录',
        cancelText: '关闭',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/user/index',
            })
          }
        },
      })
    }
    // 状态为正常
    if (this.data.item.status == 1) {
      wx.request({
        url: `${app.globalData.baseUrl}/account/msg`,
        header: { token: app.globalData.userInfo.token },
        method: 'POST',
        success: res => {
          
          if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
            var tel = this.data.item.tel || null
                if (tel) {
                  wx.request({
                    url: `${app.globalData.baseUrl}/account/call`,
                    method: 'POST',
                    header: {token: app.globalData.userInfo.token},
                    data: {id: this.data.item.id},
                    success: () => {
                      wx.makePhoneCall({
                        phoneNumber: tel,
                        success: () => {
                        
                        }
                      })
                    }
                  })
                  
                } else {
                  $Message({
                    content: '获取发布者手机号码失败',
                    type: 'error',
                  })
                }
            
          } else if(res.data.code == 400){
            $Message({
              content: '您的账户已被禁用',
              type: 'error',
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '此宝贝已失效，不可再联系发布者',
        confirmText: '我知道了',
        showCancel: false
      })
    }
  },

  // 短信
  toSms: function() {
    if (true) {
      wx.showLoading({
        title: '发送中',
        mask: true,
        success: function() {
          setTimeout(function () {
            wx.hideLoading()
            $Message({
              content: '已成功发送',
              type: 'success'
            });
          }, 3000)
        },
      })
    }
  },
  changeLike:function(id){
    console.log(wx.getStorageSync('userData'))
    if (app.globalData.userInfo){
      let token = app.globalData.userInfo.token
      id = this.data.item.id
      wx.showNavigationBarLoading()
      wx.request({
        url: app.globalData.baseUrl + "/used/collect",
        method: 'POST',
        dataType: 'json',
        header: {token: token},
        data:{ id },
        success: r=>{
          if(r.data.code == 200 ){
            var item = this.data.item
             item.collect = item.collect == 1 ? 0 : 1
             this.setData({
              item: item,
             })
          }else{
            $Message({
              content: r.data.msg || '服务器错误',
              type: 'warning',
             })
          }
        },
        complete(){
          wx.hideNavigationBarLoading()
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请登录后再进行操作',
        showCancel: true,
        confirmText: '去登录',
        cancelText: '关闭',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/user/index',
            })
          }
        },
      })
    }
  },
  // 收藏或者取消收藏
  // changeLike: function() {
  //   if (wx.getStorageSync('userData').token ) {
  //     var token = wx.getStorageSync('userData').token || wx.getStorageSync('userData').token
  //     console.log(token)
  //     return
  //     wx.showNavigationBarLoading()
  //     wx.request({
  //       url: `${app.globalData.baseUrl}/job/collect`,
  //       method: 'POST',
  //       header: {token: token},
  //       data: {id: this.data.item.id},
  //       dataType: 'json',
  //       success: res => {
  //         if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
  //           var item = this.data.item
  //           item.collect = item.collect == 1 ? 0 : 1
  //           this.setData({
  //             item: item,
  //           })
  //         } else {
  //           $Message({
  //             content: res.data.msg || '服务器错误',
  //             type: 'warning',
  //           })
  //         }
  //       },
  //       complete: function() {
  //         wx.hideNavigationBarLoading()
  //       },
  //     })
  //   } else {
  //     wx.showModal({
  //       title: '提示',
  //       content: '请登录后再进行操作',
  //       showCancel: true,
  //       confirmText: '去登录',
  //       cancelText: '关闭',
  //       success: function (res) {
  //         if (res.confirm) {
  //           wx.switchTab({
  //             url: '/pages/user/index',
  //           })
  //         }
  //       },
  //     })
  //   }
  // },
})