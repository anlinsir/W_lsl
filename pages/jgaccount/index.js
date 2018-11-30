// pages/jgaccount/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Number_type_choose_show:false,
    arr: ['dsds', 'dsdsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd', 'dasdsadsd'],
    setPass:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toSetPass(){
    this.setData({ setPass : true})
  },
  onLoad: function (options) {
  
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  showChoose(){//显示区号选择
  console.log('dshds')
    if (this.data.Number_type_choose_show){
      this.setData({ Number_type_choose_show: false })
    }else{
      this.setData({ Number_type_choose_show: true })
    }
  }
})