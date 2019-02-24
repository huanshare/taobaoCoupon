//app.js
App({
  data: {
    apiurl: 'https://www.5bei.cn/',//'http://10.6.51.156:13000/'
    sessionid: "sessionid",
    sessiondate: "sessiondate",
    errorObj: {}
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  /**
   * 设置本地缓存
   */
  setCookie: function (token) {
    wx.setStorageSync(this.data.sessionid, token);//保存sessionid
    wx.setStorageSync(this.data.sessiondate, Date.parse(new Date()))//保存当前时间，
  },
  /**
   * 获取本地缓存-登录token
   */
  getCookie: function () {
    return wx.getStorageSync(this.data.sessionid);//保存sessionid
  },
  /**
   * 删除本地缓存
   */
  removeCookie: function () {
    wx.removeStorageSync(this.data.sessionid);
    wx.removeStorageSync(this.data.sessiondate);
  },
  /**
   * 判断登录信息是否有效
   */
  checkCookieTimeOut: function () {
    var sessionid = this.getCookie();
    if (sessionid == null || sessionid == undefined || sessionid == "") {
      return false;
    }
    var sessionTime = wx.getStorageSync(this.data.sessiondate)
    var aftertimestamp = Date.parse(new Date())
    if (aftertimestamp - sessionTime >= 86400000 * 7) {
      this.removeCookie();
      return false;
    }
    return true;
  },
  /**
   * 如果本地登录信息失效，跳转到登录页面
   */
  navigateToLogin() {
    if (this.checkCookieTimeOut() == false) {
      wx.redirectTo({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
        url: '/pages/login/loginIndex'
      })
      return false;
    }
    return true;
  },
  /**
   *  显示错误的toast
   */
  showErrorMsg: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1500
    });
  },
  /**
   * 显示错误的toast,并记录LOG，后期可以扩展收集错误信息
   */
  logErrorMsg: function (errorObj) {
    this.showErrorMsg(errorObj.msg);
    console.log("error:" + JSON.stringify(errorObj));
  },
  /**
   * 显示成功的toast
   */
  showOkMsg: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'success',
      mask: true
    });
  },
  /**
   * 显示加载框
   */
  showPageLoading: function (title) {
    wx.showLoading({
      title: title ? title : "加载中",
      mask: true
    });
    wx.showNavigationBarLoading();
  },
  /**
   * 隐藏加载框
   */
  hidePageLoading: function () {
    wx.hideLoading();
    wx.hideNavigationBarLoading();
  },
  /**
   * 提示下载APP，具体与APP之间的交互，需要和APP端进行配合
   */
  openApp: function () {
    wx.showModal({
      title: '提示',
      content: '请下载APP进行操作',
      confirmText: "确定",
      confirmColor: "#52ABFF",
      showCancel: false,
      success: function (res) {
        if (res.confirm) {

        }
      }
    });
  },
  /*获取当前页url*/
  getCurrentPageUrl: function () {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
  },

  /*获取当前页带参数的url*/
  getCurrentPageUrlWithArgs: function () {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs
  },
  /**
   *
   */
  post: function (url, data, fn, header = {}) {
    var page = this;
    page.showPageLoading();

    wx.request({
      url: page.data.apiurl + url,
      method: 'post',
      data: data,
      header: header ? header : { "Content-Type": "application/json" },
      success: function (res) {
        page.hidePageLoading();
        fn(res);
      },
      fail: function (data) {
        page.hidePageLoading();
        page.showErrorMsg(data.errMsg);
      }
    });
  },
  ajax: function (param) {
    var page = this;
    if (param.before) {
      param.before();
    } else {
      page.showPageLoading();
    }
    wx.request({
      url: page.data.apiurl + param.url,
      method: param.method ? param.method : 'post',
      data: param.data ? param.data : {},
      header: param.header ? param.header : { "Content-Type": "application/json" },
      success: function (res) {
        page.hidePageLoading();
        param.success(res);
      },
      fail: function (data) {
        page.hidePageLoading();
        page.showErrorMsg(data.errMsg);
        if (param.fail) {
          param.fail();
        }
      }
    });
  },
})