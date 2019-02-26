// pages/goodDetail/goodDetail.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodDetail: {}//商品类表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    var id = 18390538;//options.id;
    app.post('api/detail.php?id=' + id, {},
      function (res) {
        if (res == null || res.data == null) {
          app.logErrorMsg({
            page: app.getCurrentPageUrlWithArgs(),
            url: app.data.apiurl + 'api/detail.php',
            msg: res.data.message
          });
          page.setData({ goodDetail:{} });
          return false;
        }
        if (res.data!=null) {
          page.setData({ goodDetail: res.data.result });
        }
      });
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