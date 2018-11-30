const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const app = getApp()

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取分类数据
const category = {
  // 在item前加上“全部职位”
  dealData: function(data) {
    for(var i in data) {
      if (data[i].children) {
        this.dealData(data[i].children)
      }
    }
    data.unshift({ id: 0, title: '全部职位' })
    return data
  },
  // 从服务器拉取数据
  getData: function({type, success, fail}) {
    var type = type || 0

    wx.showNavigationBarLoading()
    wx.request({
      url: `${app.globalData.baseUrl}/tool/category`,
      method: 'GET',
      dataType: 'json',
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          var data = res.data.data
          // 需要处理数据
          if (type == 1) {
            success(this.dealData(data))
          } else {
            success(data)
          }
        } else {
          fail()
        }
      },
      fail: fail,
      complete: function() {
        wx.hideNavigationBarLoading()
      }
    })
  }
}

// 城市数据
const citys = {
  // 在item前加上“全部职位”
  dealData: function (data, lastTitle) {
    lastTitle = lastTitle || null
    for (var i in data) {
      if (data[i].children) {
        this.dealData(data[i].children, data[i].title)
      }
    }
    data.unshift({ id: 0, title: lastTitle == null ? '全部' : lastTitle})
    return data
  },
  // 从服务器拉取数据
  getData: function ({ type, success, fail }) {
    var type = type || 0

    wx.showNavigationBarLoading()
    wx.request({
      url: `${app.globalData.baseUrl}/tool/city`,
      method: 'GET',
      dataType: 'json',
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          var data = res.data.data
          success(data)
          if (type == 1) {
            success(this.dealData(data))
          } else {
            success(data)
          }
        } else {
          fail()
        }
      },
      fail: fail,
      complete: function() {
        wx.hideNavigationBarLoading()
      }
    })
  }
}

// 获取置顶规则
const toprule = {
  // 从服务器拉取数据
  getData: function ({ success, fail }) {
    wx.showNavigationBarLoading()
    wx.request({
      url: `${app.globalData.baseUrl}/tool/rule`,
      method: 'GET',
      dataType: 'json',
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          var data = res.data.data
          success(data)
        } else {
          fail()
        }
      },
      fail: fail,
      complete: function() {
        wx.hideNavigationBarLoading()
      },
    })
  }
}

module.exports = {
  formatTime: formatTime,
  category: category,
  citys: citys,
  toprule: toprule,
}