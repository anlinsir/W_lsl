// pages/minepublish/index.js
const { $Message } = require('../../iview/base/index');
const { toprule } = require('../../utils/util.js');

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex: 0,
    page: 1,

    isLoad: false,
    items: [],

    topday: 1,
    settopbox: false,
    topboxAction: [{ name: '确 认' }],
    tmpId:'',//暂存id
  },
  toPublich(){
    wx.navigateTo({
      url:"/pages/publish/index",
    })
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
    this.getItems(1)
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

  // 改变菜单
  changeMenu: function(e) {
    this.setData({
      selectIndex: e.target.dataset.id || 0,
    })
  },

  // 关闭菜单
  resetMenu: function() {
    if (this.data.selectIndex != 0) {
      this.setData({
        selectIndex: 0,
      })
    }
  },

  // 到职位详情页面
  onDetailed: function(e) {
    var id = e.target.dataset.id || null;
    wx.navigateTo({
      url: `/pages/position/index?id=${id}`,
    })
  },

  // 置顶选择
  onSettop: function (e) {
    console.log(e.currentTarget.dataset.id)

    this.setData({ settopbox: true, topday: 1 , tmpId : e.currentTarget.dataset.id})
  },

  // 置顶确认
  handleClickItem: function(e) {
    const action = [...this.data.topboxAction];
    if (action[0].loading) {
      return $Message({ content: '正在执行操作！~', type: 'warning'})
    }

    action[0].loading = true
    this.setData({
      topboxAction: action
    });

    // 发出支付请求
    wx.request({
      url:`${app.globalData.baseUrl}/used/stick`,
      method: 'POST',
      data:{
        id:this.data.selectIndex,
        num:this.data.topday,
      },
      dataType: 'json',
      header: {token: app.globalData.userInfo.token},
      success: res => {
        this.payForTop({
          id: this.data.selectIndex,
          num: this.data.topday,
          pro_name:'used'
        })
      },
      fail: e => {
        console.log(e)
      },
    })
   
  },

  // 置顶支付
  payForTop: function (data) {
    wx.request({
      url: `${app.globalData.commomUrl}/pay/proPay`,
      method: 'POST',
      data: data,
      dataType: 'json',
      header: {token: app.globalData.userInfo.token},
      success: res => {
        if (res.statusCode == 200 && res.data.code == 200) {
          wx.requestPayment({
            timeStamp: String(res.data.data.timeStamp),
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: e => {
              wx.showModal({
                title: '提示',
                content: '支付成功，即将为您调整置顶功能。',
                showCancel: false,
                confirmText: '我知道了',
                success: e => {
                  if (e.confirm) {
                    this.setData({ settopbox: false })
                    var items = this.data.items
                    items[this.data.tmpId].is_stick = 1
                    this.setData({items : items})
                  }
                }
              })
            },
            fail: e => {
              console.log(e)
            },
            complete: () => {
              const action = [...this.data.topboxAction]
              action[0].loading = false
              this.setData({ topboxAction: action });
            },
          })
        } else {
          $Message({
            content: res.data.msg || '服务器开小差了，请稍后再试！~',
            type: 'error'
          });
          const action = [...this.data.topboxAction]
          action[0].loading = false
          this.setData({ settopbox: false, topboxAction: action });
        }
      },
    })
  },

  // 关闭设置置顶框
  settopCancel: function() {
    this.setData({settopbox: false})
  },

  // 设置置顶天数
  handleChangeTopDay: function(e) {
    this.setData({topday: e.detail.value || 0})
  },

  // 设置为已招聘
  onChecked: function (e) {
    // 已招聘？
    if (this.data.items[e.target.dataset.index].status == 2) {
      return wx.showModal({
        title: '提示',
        content: '此商品已为”已出售“',
        showCancel: false,
        confirmText: '我知道了',
      })
    }

    wx.showModal({
      title: '提示',
      content: '您将设置此条商品信息为已完成，是否继续？',
      confirmText: '继续',
      cancelText: '取消',
      success: model => {
        if (model.confirm) {
          wx.showNavigationBarLoading()
          wx.request({
            url: `${app.globalData.baseUrl}/used/complete`,
            method: 'POST',
            header: { token: app.globalData.userInfo.token },
            data: { id: e.target.dataset.id },
            dataType: 'json',
            success: res => {
              if (res.statusCode==200 && res.data.code == app.globalData.successCode) {
                var items = this.data.items
                items[e.target.dataset.index].status = 2
                // 修改
                this.setData({ items: items })
                $Message({
                  content: '修改成功',
                  type: 'success',
                })
                this.resetMenu()
              } else {
                $Message({
                  content: res.data.msg || '服务器故障',
                  type: 'error',
                })
              }
            },
            complete: function () {
              wx.hideNavigationBarLoading()
            }
          })
        }
      }
    })
  },

  // 删除职位
  onDelete: function (e) {
    wx.showModal({
      title: '提示',
      content: '您将删除此条商品信息，是否继续？',
      confirmText: '删除',
      confirmColor: '#F00',
      success: model => {
        if (model.confirm) {
          wx.showNavigationBarLoading()
          wx.request({
            url: `${app.globalData.baseUrl}/used/del`,
            method: 'POST',
            header: {token: app.globalData.userInfo.token},
            data: { id: e.target.dataset.id},
            dataType: 'json',
            success: res => {
              if (res.statusCode==200 && res.data.code==app.globalData.successCode) {
                var items = this.data.items
                items.splice(e.target.dataset.index, 1)
                // 移除
                this.setData({items: items})
                $Message({
                  content: '删除成功',
                  type: 'success',
                })
              } else {
                $Message({
                  content: res.data.msg || '服务器故障',
                  type: 'error',
                })
              }
            },
            complete: function() {
              wx.hideNavigationBarLoading()
            }
          })
        }
      }
    })
  },

  // 获取数据列表
  getItems: function (page) {
    this.setData({ isLoad: true })
    wx.showNavigationBarLoading()

    wx.request({
      url: `${app.globalData.baseUrl}/account/publish`,
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
          // 数量大于0
          if (res.data.data.length > 0) {
            if(page == 1){
              this.setData({
                items: (res.data.data),
                page: page,
              })    
            }else if(page > 1){
              this.setData({
                items: this.data.items.concat(res.data.data),
                page: page,
              })
            }
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