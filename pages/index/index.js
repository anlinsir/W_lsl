//index.js
const { $Message } = require('../../iview/base/index')
const { citys } = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    city: null,
    // 页码
    isLoad: false,
    isLoadDone: false,
    page: 1,
    latitude: 0,
    longitude: 0,
    items: [],
    einsAus:'全部分类',//一级分类
    zweiAus:'',//二级分类
    dreiAus:'',//三级分类
    choose_type_show:false,//选择类别
    city: null,
    hotlist: [],
    cityIndex: [0, 0, 0],
    cities: [],
    parts:[],//分类
  },
  tobg(){
    wx.navigateTo({
      url: '/pages/jgaccount/index'
    })
  },
  getPartPage(e){//前往分类页面
    console.log(e.currentTarget.dataset.index)
      wx.navigateTo({
        url: "/pages/part/index?keyword=" + e.currentTarget.dataset.index + e.currentTarget.dataset.name
      })
  },
  // 页面
  onLoad: function () {
    // 
    citys.getData({
      type: 1,
      success: data => {
        this.setData({
          cities: data,
          city: app.globalData.city,
          cityIndex: app.globalData.city.index || [0, 0, 0],
        })
        // 从原来选择的城市更新列表
      }
    })
    this.getclassifyList()
    this.getFirstList(1)
    
    
    // wx.request({
    //   url: `${app.globalData.baseUrl}/tool/hotCity`,
    //   method: 'GET',
    //   dataType: 'json',
    //   success: res => {
    //     if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
    //       this.setData({ hotlist: res.data.data })
    //     }
    //   }
    // })
  },

  getclassifyList:   function(){ //获取分类列表
    wx.request({
      url: `${app.globalData.baseUrl}/tool/category`,
      method: 'GET',
      dataType: 'json',
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          this.setData({ parts : res.data.data})
        }
      }
    })
  },

  getFirstList : function(page){//获取首页首次列表
    if(this.data.isLoad) return
    this.setData({isLoad :true})
    var a = app.globalData.city.a &&  app.globalData.city.a.id ? app.globalData.city.a.id : 0
    var b = app.globalData.city.b && app.globalData.city.b.id ? app.globalData.city.b.id : 0
    var c = app.globalData.city.c && app.globalData.city.c.id ? app.globalData.city.c.id : 0
    
    wx.request({
      url: `${app.globalData.baseUrl}/used/lists`,
      method: 'POST',
      dataType: 'json',
      data:{
        pa:0,
        ca:a ,
        cb:b ,
        cc:c,
        key: '',
        page: page || 1
      },
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          if(page != 1 ){
            if(res.data.data.length <= 0){

            }else{
              let tmp = this.data.items
              for(let i of res.data.data){
                tmp.push(i)
              }
              this.setData({ items: tmp})
            }
          }else{
            this.setData({items:res.data.data})
          }
        }
        this.setData({isLoad :false})
      },
      fail: function(e) {
        
      },
      complete: e => {
        // 加载完成
        wx.stopPullDownRefresh()
        this.setData({
          isLoad: false,
        })
      },
    })
  },

   getCitysByIndex: function (indexs, cities) {
    var a = cities[indexs[0]]
    var b = a && a.children && a.children[indexs[1]] || null
    var c = b && b.children && b.children[indexs[2]] || null

    return {a: a, b: b, c: c, index: indexs}
  },
  showType: function(){//显示选择类别
    if (this.data.choose_type_show){
      this.setData({ choose_type_show: false })
    }else{
      this.setData({ choose_type_show: true })
    }
      
  },
  onChangeCity: function (e) {
    console.log(e.target)
    var index = e.target.dataset.index || 0
    var value = e.target.dataset.value || 0
    // 改变
    var cityIndex = this.data.cityIndex
    cityIndex[index] = value

    // 下级索引修改
    if (index == 0) {
      this.setData({ einsAus: e.target.dataset.text })
      this.setData({ zweiAus: '' }, { dreiAus: '' })
      cityIndex[1] = cityIndex[2] = 0
    } else if (index == 1) {
      this.setData({ zweiAus: e.target.dataset.text })
      this.setData({ dreiAus: '' })
      cityIndex[2] = 0
    } else if (index == 2) {
      this.setData({ choose_type_show: false })
      this.setData({ dreiAus: e.target.dataset.text })
      
    }
    // 渲染
    this.setData({ cityIndex: cityIndex })

    var city = this.getCitysByIndex(cityIndex, this.data.cities)
    // 如果选择的第三级或者第一个
    if (value == 0 || index == 2) {
      wx.navigateBack({})
    }
    console.log(cityIndex)
  },
  selectCurrent: function () {
    app.setCityData(this.data.city)
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getFirstList(1)
    if (this.data.city != app.globalData.city) {
      this.setData({ city: app.globalData.city })
      if (!this.data.isLoad) {
        this.locationAndGetData()
       
      }
    } else {
      if (app.globalData.reload.home && !this.data.isLoad) {
        app.globalData.reload.home = false
        this.locationAndGetData()
        this.getFirstList(1)
      }
    }
  },

  // 下拉
  onPullDownRefresh: function(e) {
    if (this.data.isLoad) return
    this.locationAndGetData()

  },

  // 上拉
  onReachBottom: function(e) {
    if (this.data.isLoad) return
    this.getFirstList(++this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 到城市选择页面
  gotoCity: function(e) {
    wx.navigateTo({
      url: '/pages/city/index',
    })
  },

  // 到职位页面
  gotoPosition: function(e) {
    var id = e.target.dataset.id || null;
    wx.navigateTo({
      url: '/pages/position/index?id=' + id,
    })
  },

  // 到搜索页面
  gotoSearch: function(e) {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },

  // 到发布页面
  gotoPublish: function() {
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/publish/index',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请登录后再进行操作',
        showCancel: true,
        confirmText: '去登录',
        cancelText: '关闭',
        success: function(res){
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/user/index',
            })
          }
        },
      })
    }
  },

  // 定位并获取数据
  locationAndGetData: function() {
    wx.getLocation({
      success: (res) => {
        app.globalData.latitude = res.latitude
        app.globalData.longitude = res.longitude
        // this.setData({ items: [] })
        this.getFirstList(1)
        // this.getItems(1)
      },
      fail: () => {
        app.globalData.latitude = 0
        app.globalData.longitude = 0
        // this.setData({ items: [] })
        // this.getItems(1)
        this.getFirstList(1)
      },
    })
  },

  // 获取数据列表
  // getItems: function(page) {
  //   this.setData({isLoad: true})

  //   wx.request({
  //     url: `${app.globalData.baseUrl}/job/lists`,
  //     method: 'POST',
  //     dataType: 'json',
  //     data: {
  //       lat: app.globalData.latitude || 1,
  //       lng: app.globalData.longitude || 1,

  //       ca: app.globalData.city && app.globalData.city.a && app.globalData.city.a.id || 0,
  //       cb: app.globalData.city && app.globalData.city.b && app.globalData.city.b.id || 0,
  //       cc: app.globalData.city && app.globalData.city.c && app.globalData.city.c.id || 0,
  //       page: page,
  //       // 版本
  //       v: '0.0.3',
  //     },
  //     success: (res) => {
  //       // console.log(res)
  //       if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
  //         // 数量大于0
  //         if (res.data.data.length > 0) {
  //           this.setData({
  //             items: this.data.items.concat(res.data.data),
  //             page: page,
  //           })
  //         }
  //       } else {
  //         $Message({
  //           content: res.data.msg || '服务器出现故障',
  //           type: 'error'
  //         });
  //       }
  //     },
  //     fail: function(e) {
  //       // 
  //     },
  //     complete: e => {
  //       // 加载完成
  //       wx.stopPullDownRefresh()
  //       this.setData({
  //         isLoad: false,
  //       })
  //     },
  //   })
  // },
})
