//index.js
const {$Message} = require('../../iview/base/index')

//获取应用实例
const app = getApp();

Page({
    data: {
        countries: [],
        isShow: false,
        showTel: "",
        maxLen: 0
    },

    onLoad: function (options) {

    },

    onShow: function () {
        var countries = wx.getStorageSync('countries');
        this.setData({
            countries: countries,
            maxLen: countries[0]['tel_length'] + 2
        });
    },

    //选择国家
    onChangeCountry: function (e) {
        var c = this.data.countries;
        var i = e.currentTarget.dataset.index;
        var country = c[i];
        c.splice(i, 1);
        c.unshift(country);
        this.setData({
            'countries': c,
            'isShow': false,
            maxLen: c[0]['tel_length'] + 2,
            showTel:""
        });
        wx.setStorageSync('countries', c);
    },

    //开启或关闭选择框
    onChangeShow: function () {
        var isShow = this.data.isShow ? false : true;
        this.setData({"isShow": isShow});
    },

    //手机号输入
    onChangeTel: function (e) {
        var len = this.data.countries[0]['tel_length'];
        var tel = e.detail.value;
        var tl = tel.length;
        var showTel = this.data.showTel;
        var sl = showTel.length;
        if (len == 11) {
          if (sl <= tl && tl != 0) { //输入
              if (sl == 3 || sl == 8) {
                  showTel += "-" + tel[tl - 1];
              } else {
                  showTel += tel[tl - 1];
              }
          } else if (sl != 0) { //删除
              if (sl == 5 || sl == 10) {
                  showTel = showTel.substr(0, sl - 2);
              } else {
                  showTel = showTel.substr(0, sl - 1);
              }
          }
      } else {
          if (sl <= tl && tl != 0) { //输入
              if (sl == 3 || sl == 7)
                  showTel += "-" + tel[tl - 1];
              else
                  showTel += tel[tl - 1];
          } else if (sl != 0) { //删除
              if (sl == 5 || sl == 9)
                  showTel = showTel.substr(0, sl - 2);
              else
                  showTel = showTel.substr(0, sl - 1);
          }
      }

        this.setData({
            'showTel':showTel
        });
    },
    goToBind:function (e) {
        console.log(e);
        var tel = this.data.showTel;
        var code = this.data.countries[0]['country_code'];
        if(tel.length!=this.data.maxLen){
            $Message({
                content: '电话号码格式不正确',
                type: 'warning'
            });
            return false;
        }
        tel = tel.replace("-","");
        tel = tel.replace("-","");
        wx.navigateTo({
            url: '/pages/bind/bind?tel='+code+tel,
        })
    }
})
