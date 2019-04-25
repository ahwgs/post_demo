// pages/list/list.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        id:1,
        name:'张三',
        phone:'15955040222',
        sex:'男',
        isTouchMove:false,
      },
      {
        id: 2,
        name: '张三',
        phone: '15955040222',
        sex: '男',
        isTouchMove: false,
      },
      {
        id: 3,
        name: '张三',
        phone: '15955040222',
        sex: '男',
        isTouchMove: false,
      },
      {
        id: 4,
        name: '张三',
        phone: '15955040222',
        sex: '男',
        isTouchMove: false,
      },
      {
        id: 5,
        name: '张三',
        phone: '15955040222',
        sex: '男',
        isTouchMove: false,
      },
      {
        id: 6,
        name: '张三',
        phone: '15955040222',
        sex: '男',
        isTouchMove: false,
      },
      {
        id: 7,
        name: '张三',
        phone: '15955040222',
        sex: '男',
        isTouchMove: false,
      },
    ]
  },
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = App.touch._touchstart(e, this.data.list)
    this.setData({
      list: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = App.touch._touchmove(e, this.data.list,'id')
    this.setData({
      list: data
    })
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

  }
})