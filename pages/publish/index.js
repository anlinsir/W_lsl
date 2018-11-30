// pages/publish/index.js
const { $Message } = require('../../iview/base/index');
const { citys, category } = require('../../utils/util.js');
const $uploadVideo = require('../../utils/uploadVideo');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    title: '',
    content: '',
    isTel: false,
    top: false,
    topDay: 1,

    // 最大可选择的图片
    imagesMaxNumber: 9,
    // 选择的图片
    tempFiles: [],
    imagesUrls: [],
    // { "type": 2, "video": 'http://1255799225.vod2.myqcloud.com/cf577a2evodgzp1255799225/ca625e725285890782511378347/QATkwy3GL2MA.mp4', "url": "" }

    citys: [],
    regionArray: [[], [], []],
    region: [0, 0, 0],

    categorys: [],
    categoryArray: [[], [], []],
    categoryIndex: [0, 0, 0],


    picbox:false,


    //
    parts:[],
    partsShow:false,
    partsName:"请选择分类",
    //播放视频
    play:false,
    videoIndex:0
  },
  playVideo:function(e){
      this.setData({
          play:true,
          videoIndex:e.currentTarget.dataset.index
      });
  },
  stopPlay:function(e){
      this.setData({
          play:false,
      });
  },
  closeSelect(){//取消选择分类  
    this.setData({partsShow :false})
  },
  picCancel(){//取消
    this.setData({ picbox :false})
  },
  picOpen() {//点击拍照
    var count = this.data.imagesMaxNumber - this.data.imagesUrls.length

    if (count <= 0) {
      $Message({ content: `你最多可以上传${this.data.imagesMaxNumber}张图片` })
      return
    }

    var that = this
    wx.chooseImage({
      count: count,
      success: res => {
        var tempFiles = res.tempFiles
        wx.showLoading({ title: '上传中' })
        this.uploadImageFile(tempFiles, 0, tempFiles.length)
        this.setData({ picbox :false})
      },
    })
  },
  videoding(){//点击录像
      //获取相机实例
    wx.chooseVideo({})
  },
  //获取视频签名
  getSignature: function (callback) {
    var that = this;
    wx.request({
      url: `${app.globalData.commomUrl}/tool/videoSign`,
      method: 'GET',
      dataType: 'json',
      header: { token: app.globalData.userInfo.token },
      success: function (res) {
        console.log(res)
        wx.showLoading({ title: '上传中' })
        if (res.data.code == 200 && res.data.data.sign) {
          callback(res.data.data.sign);
        } else {
          return '获取签名失败';
        }
      }
    });
  },
  //选择视频
  onChooseVideo: function () {
    var count = this.data.imagesMaxNumber - this.data.imagesUrls.length;
    if (this.data.imagesUrls.length == 0) {
      $Message({ content: `第一张必须上传图片` })
      return
    }
    if (count <= 0) {
      $Message({ content: `你最多可以上传${this.data.imagesMaxNumber}张图片或视频` })
      return
    }
    this.setData({ picbox: false });
    var that = this;
    wx.chooseVideo({
      sourceType: ['camera'],
      success: function (res) {
        console.log(res)
        $uploadVideo.start({
          videoFile: res, //必填，把chooseVideo回调的参数(file)传进来
          fileName: '简购二手小程序', //选填，视频名称，强烈推荐填写(如果不填，则默认为“来自微信小程序”)
          getSignature: that.getSignature, //必填，获取签名的函数
          success: function (result) {
            console.log(result)
          },
          error: function (result) {
            wx.showModal({
              title: '上传失败',
              content: "上传失败",
              showCancel: false
            });
          },
          finish: function (result) {
            console.log(result);
            wx.hideLoading();
            var imagesUrls = that.data.imagesUrls
            var img = { "type": 2, "video": result.videoUrl, "url": "" }
            imagesUrls.push(img)
            that.setData({ imagesUrls: imagesUrls, picbox: false })
            wx.showModal({
              title: '上传成功',
              content: '上传成功',
              showCancel: false
            });
          }
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getclassifyLists()
    // 加载地址
    citys.getData({
      success: data => {
        this.setData({ citys: data })
        this.setData({
          regionArray: this.refreshArray([0, 0, 0], this.data.citys)
        })
      }
    })

    // 加载职位
    category.getData({
      success: data => {
        this.setData({ categorys: data })
        this.setData({
          categoryArray: this.refreshArray([0, 0, 0], this.data.categorys)
        })
      }
    })

    // 获取经纬度
    wx.getLocation({
      success: (res) => {
        app.globalData.latitude = res.latitude
        app.globalData.longitude = res.longitude
      },
      fail: function () {
        // wx.showModal({
        //   title: '定位授权',
        //   content: '请手动开启此小程序的定位授权。',
        //   showCancel: false,
        //   success: function(e) {
        //     if (e.confirm) {
        //       wx.navigateBack({})
        //     }
        //   },
        // })
        app.globalData.latitude = 1
        app.globalData.longitude = 1
      },
    })
  },


  
  onShow: function () {
   
  },

  getclassifyLists:function () { //获取分类列表
    wx.request({
      url: app.globalData.baseUrl + "/tool/category",
      method: 'GET',
      dataType: 'json',
      success: res => {
        if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
          let data = res.data
          this.setData({ parts: data })
        }
      }
    })
  },
  partsStateChange(){
    this.setData({ partsShow: !this.data.partsShow})
  },
  onChangeParts(e){
    console.log(e.currentTarget.dataset.name)
    this.setData({ partsName: { name: e.currentTarget.dataset.name, id: e.currentTarget.dataset.id}} )
    this.setData({ partsShow: !this.data.partsShow })
    
  },
  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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

  // 获取3级级联数据
  refreshArray: function (indexs, t1) {
    var a = [], b = [], c = []

    // 第一级
    for (var i in t1) {
      a.push(t1[i].title)
    }

    // 第二级
    var t2 = t1[indexs[0]] && t1[indexs[0]].children || null
    if (t2 != null) {
      for (var i in t2) {
        b.push(t2[i].title)
      }

      // 第三级
      var t3 = t2[indexs[1]] && t2[indexs[1]].children || null
      if (t3 != null) {
        for (var i in t3) {
          c.push(t3[i].title)
        }
      }
    }

    return [a, b, c]
  },

  // 通过索引获取层级数据的ID
  getIdByIndex: function(indexs, t1) {
    var a = 0, b = 0, c = 0
    a = t1[indexs[0]].id

    var t2 = t1[indexs[0]] && t1[indexs[0]].children || null
    if (t2 != null) {
      b = t2[indexs[1]] && t2[indexs[1]].id || 0

      var t3 = t2[indexs[1]] && t2[indexs[1]].children || null
      if (t3 != null) {
        c = t3[indexs[2]] && t3[indexs[2]].id || 0
      }
    }

    return {a: a, b: b, c: c}
  },

  // 滑动工作地址
  onColumnChangeRegin: function(e) {
    var region = this.data.region
    region[e.detail.column] = e.detail.value

    this.setData({
      regionArray: this.refreshArray(region, this.data.citys)
    })
  },

  // 确定工作地址
  onChangeRegin: function (e) {
    // console.log(e)
    this.setData({
      region: e.detail.value
    })
  },

  // 滑动职位分类
  onColumnChangeCategory: function (e) {
    var category = this.data.categoryIndex
    category[e.detail.column] = e.detail.value

    this.setData({
      categoryArray: this.refreshArray(category, this.data.categorys)
    })
  },

  // 确定职位分类
  onChangeCategory: function (e) {
    // console.log(e)
    this.setData({
      categoryIndex: e.detail.value
    })
  },

  // 选择图片
  onChooseImage: function() {
    console.log(this.data.picbox)
    this.setData({ picbox : true})
    return
    var count = this.data.imagesMaxNumber - this.data.imagesUrls.length

    if (count <= 0) {
      $Message({content: `你最多可以上传${this.data.imagesMaxNumber}张图片`})
      return
    }

    var that = this
    wx.chooseImage({
      count: count,
      success: res => {
        var tempFiles = res.tempFiles
        wx.showLoading({ title: '上传中' })
        this.uploadImageFile(tempFiles, 0, tempFiles.length)
      },
    })
  },

  // 上传图片
  uploadImageFile: function (tempFiles, i, length) {
    var path = tempFiles[i] && tempFiles[i].path || null

    wx.uploadFile({
      url: `${app.globalData.commomUrl}/tool/uploadImg`,
      filePath: path,
      name: 'file',
      header: {token: app.globalData.userInfo.token},
      success: res => {
        if(res.statusCode == 200) {
          var data = JSON.parse(res.data)
          if (data.code == app.globalData.successCode) {
            var imagesUrls = this.data.imagesUrls
            var img = {"type":1,"video":"","url":data.data.img}
            if(!imagesUrls[0]){
              imagesUrls[0] =  img
            }else if(imagesUrls[0]){
              imagesUrls.push(img)
            }
            

            this.setData({ imagesUrls: imagesUrls })
          } else {
            $Message({ content: data.msg, type: 'error' })
          }
        } else {
          $Message({content: '服务器错误', type: 'error'})
        }
      },
      complete: () => {
        i = i + 1
        if (i == length) {
          // 上传完成
          wx.hideLoading()
        } else {
          this.uploadImageFile(tempFiles, i, length)
        }
      },
    })
  },

  // 移除图片
  onRemoveImage: function(e) {
    var imagesUrls = this.data.imagesUrls
    var index = e.currentTarget.dataset.index
    if(index != 0){
      imagesUrls.splice(index, 1)
      
    }else if(index == 0){
      imagesUrls[0] = ''
    }
    this.setData({
      imagesUrls: imagesUrls,
    })
  },

  // 获取手机号码
  getPhoneNumber: function(e) {
    if (e.detail.encryptedData && e.detail.iv) {
      wx.showNavigationBarLoading()
      wx.request({
        url: `${app.globalData.commomUrl}/account/getPhone`,
        method: 'POST',
        dataType: 'json',
        header: {token: app.globalData.userInfo.token},
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          pro_name:'used'
        },
        success: res => {
          if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
            this.setData({
              phone: res.data.data.tel,
            })
          } else {
            $Message({
              content: res.data.msg || '服务器错误',
              type: 'error',
            })
          }
        },
        complete: function() {
          wx.hideNavigationBarLoading()
        }
      })
    }
  },

  // 提示置顶信息
  onTipsTop: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '使用积分兑换置顶天数后，信息将显示在列表顶部，置顶天数到期，信息将在列表按正常顺序显示',
      cancelText: '取消',
      // confirmText: that.data.top?'确定':'打开',
      confirmText: '确定',
      confirmColor:'#F27047',

      success: function(e) {
        // if (e.confirm) {
        //   that.setData({
        //     top: true,
        //   })
        // } else if (e.cancel) {
        //   //  
        // }
      },
    })
  },

  // 电议状态
  onChangeisTel: function () {
    this.setData({
      isTel: !this.data.isTel,
    })
  },

  // 置顶状态
  onChangeTop: function() {
    this.setData({
      top: !this.data.top,
    })
  },

  // 改变置顶天数
  handleChangeTopDay: function(e) {
    console.log(e)
    this.setData({
      topDay: e.detail.value || 0,
    })
  },

  // 输入内容
  inputContent: function(e) {
    this.setData({ content: e.detail.value})
  },

  // 输入标题
  inputTitle: function(e) {
    this.setData({ title: e.detail.value })
  },

  // 输入薪资
  inputPrice: function(e) {
    var value = e.detail.value
    if (value > 99999.99) {
      value = 99999.99
    }
    this.setData({price: value})
    return value
  },

  // 输入电话号码
  inputPhone: function(e) {
    this.setData({ phone: e.detail.value })
  },

  // 点击发布按钮
  onDone: function(e) {
    var formId = e.detail.formId || null
    if (formId == null) {
      return $Message({ content: 'formId获取失败', type: 'error' })
    }

    var title = this.data.title.replace(/\s/g, '') || null
    if (title == null) {
      return $Message({ content: '请输入二手标题', type: 'error' })
    }else if(title.length < 2 || title.length > 17 ){
      return $Message({ content: '标题长度为2-17个字（不包括空格）', type: 'error' })
    }

    var content = this.data.content || null
    if (content == null) {
      return $Message({ content: '请加一些描述', type: 'error' })
    }
  
    var phone = this.data.phone || null
    if (phone == null) {
      return $Message({ content: '请获取手机号码', type: 'error' })
    }

    var price = this.data.price || 0
    var isTel = this.data.isTel
    if (isTel) {
      price = 0
    } else if (price <= 0) {
      return $Message({ content: '请输入一个合理的价格', type: 'error' })
    }

    var category = this.getIdByIndex(this.data.categoryIndex, this.data.categorys)
    var region = this.getIdByIndex(this.data.region, this.data.citys)

    if(!this.data.partsName.id){
      return $Message({ content: '请选择分类', type: 'error' })
    }else{
      var pa = this.data.partsName.id
    }
    if(!this.data.imagesUrls[0] || !this.data.imagesUrls[0].url){
      return $Message({ content: '主图必须上传', type: 'error' })
    }
    var images = JSON.stringify(this.data.imagesUrls);
    console.log(images)
    // return
    // 构造数据
    var data = {
      // form_id: formId,

      // 地区
      ca: region.a,
      cb: region.b,
      cc: region.c,
      // 职位
      pa: pa,
   
      title: title,
      content: content,
      price: price,

      // // 经纬度
      // lat: app.globalData.latitude,
      // lng: app.globalData.longitude,

      // 图片
      images,

      // 置顶天数
      stick_num: this.data.top && this.data.topDay || 0,

      // 手机号码
      tel: phone,
    }

  

    wx.showModal({
      title: '提示',
      content: '出售完成后，可在“我的”页面中“我的发布”修改出售状态为“已完成”',
      showCancel: false,
      confirmText: '继续发布',
      success: res => {
        if (res.confirm) {
          this.doPublish(data)
        }
      },
    })
  },

  // 发布
  doPublish: function(data) {
    wx.showLoading({
      title: '发布中',
      mask: true,
      success: () => {
        wx.request({
          url: `${app.globalData.baseUrl}/used/publish`,
          method: 'POST',
          data: data,
          header: {token: app.globalData.userInfo.token},
          dataType: 'json',

          success: res => {
            if (res.statusCode == 200 && res.data.code == app.globalData.successCode) {
              // 返回首页时刷新数据
              app.globalData.reload.home = true
              // 发布成功返回的ID
              // 需要置顶
              if (data.stick_num > 0) {
                this.payForTop({
                  id: res.data.data.id,
                  num: data.stick_num,
                  pro_name:'used'
                })
              } else {
                wx.redirectTo({
                  url: `/pages/publish/done?id=${res.data.data.id}`,
                })
              }
            } else {
              wx.showModal({
                title: '发布失败',
                content: res.data.msg || '服务器开小差了，请稍后再试！~',
                showCancel: false,
                complete: function() {
                  wx.hideLoading()
                },
              })
            }
          },
          complete: (e) => {
            if (data.stick_num <= 0) {
              wx.hideLoading()
            }
          }
        })

      }
    })
  },

  // 置顶支付
  payForTop: function(data) {
    wx.request({
      url: `${app.globalData.commomUrl}/pay/proPay`,
      method: 'POST',
      data: data,
      dataType: 'json',
      header: { token: app.globalData.userInfo.token },
      success: res => {
        if (res.statusCode == 200 && res.data.code == 200) {
          wx.requestPayment({
            timeStamp: String(res.data.data.timeStamp),
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: e => {
              wx.redirectTo({
                url: `/pages/publish/done?id=${data.id}`,
              })
            },
            fail: e => {
              console.log(e)
              wx.showModal({
                title: '提示',
                content: '支付失败，但发布成功，您可以到“我的”页面“我的发布”再次置顶。',
                confirmText: '再次尝试',
                cancelText: '我知道了',
                cancelColor: '#333',
                success: e => {
                  if (e.confirm) {
                    this.payForTop(data)
                  } else if (e.cancel) {
                    wx.redirectTo({
                      url: `/pages/publish/done?id=${data.id}`,
                    })
                  }
                },
              })
            }
          })
        } else {
          wx.redirectTo({
            url: `/pages/publish/done?id=${data.id}`,
          })
        }
      },
      complete: function() {
        wx.hideLoading()
      },
    })
  },
})