// pages/snatch/snatch.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodList: [],//商品类表
    page: 1,
    num: 4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    app.post('api/realTime.php?page=' + page.data.page + "&num=" + page.data.num, {},
      function (res) {
        if (res == null || res.data == null) {
          app.logErrorMsg({
            page: app.getCurrentPageUrlWithArgs(),
            url: app.data.apiurl + 'api/top100.php',
            msg: res.data.message
          });
          page.setData({ goodList: [] });
          return false;
        }
        if (res.data.length > 0) {
          var newGoodList = page.data.goodList.concat(res.data)
          page.setData({ goodList: newGoodList });
        } else {
          wx.showToast({
            title: '就这些啦',
            duration: 2000
          })
        }
      });
  },
  /**
   * 查看详情
   */
  showGoodDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id == undefined || id == null) {
      return false;
    }
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + id
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
    var page = this;
    page.setData({ goodList: [], page: 1 });
    page.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this;
    page.setData({ page: page.data.page + 1 });
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})