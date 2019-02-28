// pages/goodDetail/goodDetail.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodDetail: {},//商品类表
    quanLink: '',//优惠券URL
    goodImageUrl: '',//宝贝图片URL
    goodTitle: '',//宝贝标题
    goodId: '',
    taoKouLing:'',
    taobaoId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    var id = options.id;
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
        if (res.data != null && res.data.result!=null) {
          var detail = res.data.result;
          page.setData({ goodDetail: detail, 
                          quanLink: detail.Quan_link, 
                          goodImageUrl: detail.Pic, 
                          goodTitle: detail.D_title,
                          goodId: detail.ID,
                          taobaoId: detail.GoodsID });
        }
      });
  },
  /**
   * 查看详情
   */
  return_back: function (e) {
    wx.switchTab({
      url: '../top100/top100',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
    });
  },
  /**
   * 查看详情
   */
  get_tol: function (e) {
    var page = this;
    var quan_link = page.data.quanLink.replace(/[\\]/g, '');
    var activityId = app.getQueryString('activityId',quan_link);
    var returnUrl = 'https://uland.taobao.com/coupon/edetail?activityId=' + activityId + '&pid=mm_29143610_310100151_84258300085&itemId=' + page.data.taobaoId;
    app.post('api/taobao/tpwd.php?text=' + encodeURIComponent(page.data.goodTitle) 
      + "&url=" + encodeURIComponent(returnUrl)
      + "&logoUrl=" + encodeURIComponent(page.data.goodImageUrl.replace(/[\\]/g, '')), {},
      function (res) {
        if (res == null || res.data == null) {
          app.logErrorMsg({
            page: app.getCurrentPageUrlWithArgs(),
            url: app.data.apiurl + '/api/taobao/tpwd.php',
            msg: res.data.message
          });
          page.setData({ taoKouLing: {} });
          return false;
        }
        if (res.data != null) {
          var detail = res.data.data;
          page.setData({ taoKouLing: detail.model});
          wx.setClipboardData({
            data: detail.model,
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                  wx.showToast({
                    title: '请打开淘宝'
                  })
                }
              })
            }
          });
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
    var page = this;
    page.setData({ 
      goodDetail: {},
      quanLink: '',//优惠券URL
      goodImageUrl: '',//宝贝图片URL
      goodTitle: '',//宝贝标题
      taoKouLing: '', });
    var option = { id: page.data.goodId}
    page.onLoad(option);
    wx.stopPullDownRefresh();
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