//app.js
App({
  // 进入前台
  onLaunch: function () {
    this.getUserInfo()
    this.getCityData()
    this.sendUsedLog(2)
  },

  // 进入后台
  onHide: function() {
    // console.log('onHide')
    this.sendUsedLog(3)
  },

  // 发出使用记录请求
  sendUsedLog: function(t) {
    if (this.globalData.userInfo) {
      t = t || 2
      // wx.request({
      //   url: `${this.globalData.baseUrl}/tool/used`,
      //   method: 'POST',
      //   header: { token: this.globalData.userInfo.token },
      //   data: { type: t },
      // })
    }
  },

  globalData: {
    // baseUrl: 'https://hiring.jglist.cn',
    // baseUrl: 'http://52.81.24.111:8081',
    baseUrl:'http://52.81.24.111:8095',
    successCode: 200,
    commomUrl:'http://52.81.24.111:8088',
    // 定位
    latitude: 0,
    longitude: 0,

    userInfo: null,
    city: {a: {id: 0, title: '全部'}},

    // 返回时是否刷新页面
    reload: {home: false}
  },

  // 持久化存储用户数据
  setUserInfo: function (data) {
    this.globalData.userInfo = data
    wx.setStorageSync('user', data)
  },

  // 从本地获取用户授权信息
  getUserInfo: function() {
    this.globalData.userInfo = wx.getStorageSync('user') || null

    // 登录
    wx.login({
      success: (login) => {
        wx.getUserInfo({
          withCredentials: true,
          success: (info) => {
            var userInfo = info.userInfo
            wx.request({
              url: `${this.globalData.commomUrl}/account/proLogin`,
              method: 'POST',
              data: {
                // nickname: userInfo.nickName,
                // thumb: userInfo.avatarUrl,
                code: login.code,
                iv: info.iv,
                encryptedData: info.encryptedData,
                pro_name:'used'
              },
              dataType: 'json',
              success: rsp => {
                if (rsp.statusCode == 200) {
                  if (rsp.data.code == this.globalData.successCode) {
                    var user = {
                      nickname: rsp.data.data.nickname,
                      avatar: rsp.data.data.thumb,
                      token: rsp.data.data.token,
                    }
                    // 设置登录数据
                    this.setUserInfo(user)
                  }
                }
              },
            })
          },
        })
      },
    })

    // 有登录信息
    if (this.globalData.userInfo) {
      wx.request({
        url: `${this.globalData.baseUrl}/account/msg`,
        header: { token: this.globalData.userInfo.token },
        method: 'POST',
        success: res => {
          
          if (res.statusCode == 200 && res.data.code == this.globalData.successCode) {
            console.log(res.data.data.data.violations_count)
            if (res.data.data.data.violations_count > 0) {
              
              this.showWarning(res.data.data)
            }
          } else {
            this.globalData.userInfo = null
          }
        }
      })
    }
  },

  // 移除本地用户信息
  removeUserInfo: function(success) {
    this.globalData.userInfo = null
    wx.removeStorageSync('user')
  },

  // 持久化存储城市筛选
  setCityData: function (data) {
    this.globalData.city = data
    wx.setStorageSync('city', data)
  },

  // 从本地获取城市筛选
  getCityData: function () {
    this.globalData.city = wx.getStorageSync('city') || { a: { id: 0, title: '全部' } }
  },

  // 显示警告框
  showWarning: function(data) {
    var count = wx.getStorageSync('warning') || 0
    
    var day = parseInt(data.data.frozen_day)
    if (day <= 0) return

    if (count != data.data.violations_count) {
      wx.showModal({
        title: '抱歉',
        content: `由于您发布的信息违反规则，发布功能被禁止${day}天。请不要发布违反规则的内容。`,
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            wx.showModal({
              title: '规则',
              content: '第一次惩罚，禁止发布1天，第二次惩罚，禁止发布3天，第三次惩罚，禁止发布7天，第四次，永久禁止发布。',
              showCancel: false,
            })
          }
        },
        complete: () => {
          wx.setStorageSync('warning', data.data.violations_count)
        },
      })
    }
  },
})