// pages/search-result/index.js
const { category } = require('../../utils/util.js');
const { $Message } = require('../../iview/base/index');

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: "",
    items: [],
    page: 1,
    isLoad: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  gotoSearch: function (keyword) {
    wx.navigateTo({
      url: '/pages/search-result/index?keyword=' + keyword,
    })
  },
  onLoad: function (options) {
    
    this.setData({
      city: app.globalData.city,
    })
   
    var keyword = options.keyword || null;
    if (keyword != null) {
      this.setData({
        keyword: keyword,
      })
    }

    // 获取分类
    category.getData({
      type: 1,
      success: data => {
        this.setData({
          category: data
        })
        this.getResult()
        // 获取初始数据
      },
      fail: () => {
        // 
      }
    })
  },
  gotoCity: function () {
      wx.navigateTo({
        url: '/pages/city/index',
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
    this.setData({
      city: app.globalData.city,
    })
    if (this.data.isLoad) return
    this.setData({ items: [] })
    this.getResult(1)
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
    this.setData({items: []})
    this.getResult(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad) return
    this.getResult(this.data.page + 1)
  },

  // 改变职位筛选
  onChangeFilterPosition: function(e) {
    var index = e.target.dataset.index || 0
    var value = e.target.dataset.value || 0
    // 改变
    var positionIndexs = this.data.positionIndexs
    positionIndexs[index] = value

    if (index == 0) {
      positionIndexs[1] = positionIndexs[2] = 0
    } else if (index == 1) {
      positionIndexs[2] = 0
    }

    // 选择了第三级或者选择的值是第一个就关闭筛选框
    if (index == 2 || value == 0) {
      this.setData({ filterIndex: -1 })
    }
  
    // 重新拉取数据
    this.setData({ positionIndexs: positionIndexs, items: [] })
    // this.getPositionId()
  },

  // 改变薪资筛选事件
  onChangefilterPrice: function (e) {
    var index = e.target.dataset.index || 0
    // 重新拉取数据并关闭筛选框
    this.setData({ filterPriceIndex: index, filterIndex: -1, items: [] })
   
  },

  // 改变筛选tab事件
  onChangeFilterBar: function(e) {
    var index = e.currentTarget.dataset.index || 0
    if (this.data.filterIndex == index) {
      index = -1
    }
    this.setData({
      filterIndex: index,
    })
  },

  // 到职位详情页面
  gotoPosition: function(e) {
    var id = e.target.dataset.id || null;
    wx.navigateTo({
      url: `/pages/position/index?id=${id}`,
    })
  },

  // 搜索
  tappedSearch: function(e) {
    var keyword = e.detail.value || ''
    // 重新拉取数据
    this.setData({keyword: keyword, items: []})
    this.getResult(1)
  },

  // 处理职位筛选的ID
  getPositionId: function() {
    var a = this.data.category[this.data.positionIndexs[0]]
    var b = a && a.children && a.children[this.data.positionIndexs[1]] || null
    var c = b && b.children && b.children[this.data.positionIndexs[2]] || null

    this.setData({
      tabPositionText: c&&c.id!=0&&c.title||b&&b.id!=0&&b.title||a&&a.id!=0&&a.title||'职位'
    })

    return {a: a && a.id || 0, b: b && b.id || 0, c: c && c.id || 0}
  },


  getResult:function(page){
    this.setData({ isLoad: true })
    // wx.showNavigationBarLoading()
    page = page || 1
    var a = app.globalData.city.a && app.globalData.city.a.id ? app.globalData.city.a.id : 0
    var b = app.globalData.city.b && app.globalData.city.b.id ? app.globalData.city.b.id : 0
    var c = app.globalData.city.c && app.globalData.city.c.id ? app.globalData.city.c.id : 0
    wx.request({
      url: `${app.globalData.baseUrl}/used/lists`,
      method: 'POST',
      dataType: 'json',
      data: {
        pa: 0,
        ca: a,
        cb: b,
        cc: c,
        key: this.data.keyword,
        page: page
      },
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          
          if(res.data.data.length > 0){
            if(page == 1){
              this.setData({ items: res.data.data,page : page})
            }else if(page > 1){
              this.setData({ items: this.data.items.concat(res.data.data) ,page : page})
            }
          }else{

          }
        }
      },
      complete: e => {
        // 加载完成
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        this.setData({ isLoad: false })
        this.setData({ filterIndex : -1})
      },
    })
  },






  // 获取及渲染数据
  getItems: function(page) {
    this.setData({ isLoad: true })
    wx.showNavigationBarLoading()

    page = page || 1;
    var filterPrice = this.data.filterPrices[this.data.filterPriceIndex]
    var position = this.getPositionId()

    wx.request({
      url: `${app.globalData.baseUrl}/job/lists`,
      method: 'POST',
      dataType: 'json',
      data: {
        // 经纬度
        lat: app.globalData.latitude || 1,
        lng: app.globalData.longitude || 1,

        // 关键字
        key: this.data.keyword,

        // 薪资范围
        low: filterPrice.down,
        high: filterPrice.up,

        // 城市筛选
        ca: app.globalData.city.a && app.globalData.city.a.id || 0,
        cb: app.globalData.city.b && app.globalData.city.b.id || 0,
        cc: app.globalData.city.c && app.globalData.city.c.id || 0,

        // 职位筛选
        pa: position.a,
        pb: position.b,
        pc: position.c,

        // 页码
        page: page,

        // 版本
        v: '0.0.3',
      },
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          // 数量大于0
          if (res.data.data.length > 0) {
            // 设置数据及更新页码
            this.setData({
              items: this.data.items.concat(res.data.data),
              page: page,
            })
          } else if (page == 1) {
            // $Message({
            //   content: '未找到相关职位',
            //   type: 'warning',
            // })
          }
        } else {
          $Message({
            content: res.data.msg || '服务器出现故障',
            type: 'error'
          });
        }
      },
      fail: function (e) {
        // 加载失败
      },
      complete: e => {
        // 加载完成
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        this.setData({ isLoad: false })
      },
    })
  },
})