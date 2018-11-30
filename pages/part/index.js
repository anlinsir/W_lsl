// pages/part/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    page: 1,
    isLoad: false,
    titleId:'',
    partList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  gotoPosition: function(e) {
    var id = e.target.dataset.id || null;
    wx.navigateTo({
      url: `/pages/position/index?id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.locationAndGetData()
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var options = currentPage.options //如果要获取url中所带的参数可以查看options
    var title = (options.keyword).slice(1)
    this.setData({ titleId: (options.keyword).slice(0,1)})
    wx.setNavigationBarTitle({
      title: title
    })
    this.getPart()

  },
 
  getPart(page,id){
    if(this.data.isLoad == true){
      return
    }
    this.setData({isLoad:true})
    var a = app.globalData.city.a && app.globalData.city.a.id ? app.globalData.city.a.id : 0
    var b = app.globalData.city.b && app.globalData.city.b.id ? app.globalData.city.b.id : 0
    var c = app.globalData.city.c && app.globalData.city.c.id ? app.globalData.city.c.id : 0
    page = page || 1
    wx.request({
      url: `${app.globalData.baseUrl}/used/lists`,
      method: 'POST',
      dataType: 'json',
      data: {
        pa: Number(id) || Number(this.data.titleId )+ 1,
        ca: a,
        cb: b,
        cc: c,
        key: '',
        page: page
      },
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
        //  this.items = r.data.data
          console.log(res.data.data)
          if(res.data.data.length > 0){
            if(page == 1){
              this.setData({ partList: res.data.data,page:page})
            }else if(page > 1){
              this.setData({ partList: this.data.partList.concat(res.data.data) ,page:page})
            }
          }else{
            
          }
          
        }
      },
      fail: function(e) {
        
      },
      complete: c=>{
        wx.stopPullDownRefresh()
        this.setData({isLoad:false})
      }
      
    })
  },




  locationAndGetData: function () {
    wx.getLocation({
      success: (res) => {
        app.globalData.latitude = res.latitude
        app.globalData.longitude = res.longitude
        this.setData({ items: [] })
      },
      fail: () => {
        app.globalData.latitude = 0
        app.globalData.longitude = 0
        this.setData({ items: [] })
      },
    })
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
    this.getPart(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getPart(this.data.page +1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})