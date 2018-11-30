// components/position/position.js
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    showCover: {
      type: Boolean,
      value: false,
    },
    isTell: {
      type: Boolean,
      value: false,
    },
    top: {
      type: Boolean,
      value: false,
    },
    invalid: {
      type: Boolean,
      value: false,
    },
    icon: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    price: {
      type: String,
      value: "面议",
    },
    level: {
      type: String,
      value: '',
    },
    position: {
      type: String,
      value: '',
    },
    city: {
      type: String,
      value: '',
    },
    date: {
      type: String,
      value: '',
    },
    status:{
      type: String,
      value: '',
    },
    is_stick:{
      type:Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRemove: function(e) {
      this.triggerEvent('remove');
    },

    onDetailed: function(e) {
      this.triggerEvent('detailed')
    },

    onSettop: function (e) {
      this.triggerEvent('settop')
    },

    onChecked: function (e) {
      this.triggerEvent('checked')
    },

    onDelete: function (e) {
      this.triggerEvent('delete')
    },
  }
})
