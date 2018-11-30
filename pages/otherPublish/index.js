// pages/otherPublish/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    info:[],
    userID:'',
    ID:'',
    pageCuu:1,
    noneData:false,
    loading:false,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({ userID: options.id })
    this.getOtherPublic(options.id,this.data.pageCuu)
    this.getOtherUserInfo(options.id)
    this.setData({ID:options.id})
  },
  gotoPosition: function(e) {
    var id = e.target.dataset.id || null;
    wx.navigateTo({
      url: '/pages/position/index?id=' + id,
    })
  },
  getOtherPublic: function(id,page){
    if(this.data.loading == true){
      return
    }
    this.setData({loading : true})
    page = page || 1
    wx.request({
      url: app.globalData.baseUrl + "/used/hisPublish",
      method: 'POST',
      dataType: 'json',
      data:{id,page},
      success: r => { 
        console.log(r.data)
        if(r.data.data.length > 0){//有数据时
          if(page == 1){
            this.setData({ items : r.data.data  })
            this.setData({pageCuu:page})
          }else if(page > 1){
            this.setData({ items : this.data.items.concat(r.data.data)  })
            this.setData({pageCuu:page})
            this.setData({ noneData : false})
          }
          
        }else{
          this.setData({ noneData : true})
        }
        this.setData({loading : false})
        
      },
      fail: function(e) {
        $Message({ content: e, type: 'error' })
      },
      complete: c=>{
        wx.stopPullDownRefresh()
        this.setData({isLoad:false})
      }
    })
  },

  getOtherUserInfo:function(id){
    wx.request({
      url: app.globalData.commomUrl + "/account/msg",
      method: 'POST',
      dataType: 'json',
      data: { id },
      success: r => {
        console.log(r)
        this.setData({ info: r.data.data })
      }
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
    this.getOtherPublic(this.data.ID,1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getOtherPublic(this.data.ID,Number(this.data.pageCuu) + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})