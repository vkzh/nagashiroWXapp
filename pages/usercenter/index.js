import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';

const menuData = [
  [
    {
      title: '收货地址',
      tit: '',
      url: '',
      type: 'address',
    },
    {
      title: '联系客服',
      tit: '',
      url: '',
      type: 'service',
      icon: 'service',
    },
    {
      title: '切换语言',
      tit: '3种',
      url: '',
      type: 'point',
    },
  ],
  [
    {
      title: '用户协议',
      tit: '',
      url: '',
      type: 'help-center',
    },
    {
      title: '关于',
      tit: '',
      url: '',
      type: 'info',
    },
  ],
];

const orderTagInfos = [
  {
    title: '全部订单',
    iconName: 'wallet',
    orderNum: 0,
    tabType: 5,
    status: 1,
  },
  {
    title: '待发货',
    iconName: 'deliver',
    orderNum: 0,
    tabType: 10,
    status: 1,
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 0,
    tabType: 40,
    status: 1,
  },
  // {
  //   title: '待评价',
  //   iconName: 'comment',
  //   orderNum: 0,
  //   tabType: 60,
  //   status: 1,
  // },
  // {
  //   title: '退款/售后',
  //   iconName: 'exchang',
  //   orderNum: 0,
  //   tabType: 0,
  //   status: 1,
  // },
];

const getDefaultData = () => ({
  showMakePhone: false,
  showChangeLang: false,
  selectedLanguage: wx.getStorageSync('language'),
  userInfo: {
    avatarUrl: '',
    nickName: '正在登录...',
    phoneNumber: '',
  },
  menuData,
  orderTagInfos,
  customerServiceInfo: {},
  currAuthStep: 1,
  showKefu: true,
  versionNo: '',
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.getVersionInfo();
  },

  onShow() {
    this.getTabBar().init();
    this.init();
  },
  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.fetUseriInfoHandle();
  },

  fetUseriInfoHandle() {
    fetchUserCenter().then(
      ({
        userInfo,
        countsData,
        orderTagInfos: orderInfo,
        customerServiceInfo,
      }) => {
        // eslint-disable-next-line no-unused-expressions
        menuData?.[0].forEach((v) => {
          countsData.forEach((counts) => {
            if (counts.type === v.type) {
              // eslint-disable-next-line no-param-reassign
              v.tit = counts.num;
            }
          });
        });
        const info = orderTagInfos.map((v, index) => ({
          ...v,
          ...orderInfo[index],
        }));
        this.setData({
          userInfo,
          menuData,
          orderTagInfos: info,
          customerServiceInfo,
          currAuthStep: 2,
        });
        wx.stopPullDownRefresh();
      },
    );
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'address': {
        wx.navigateTo({ url: '/pages/usercenter/address/list/index' });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了帮助中心',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'point': {
        this.openChangeLang();
        break;
      }
      case 'coupon': {
        wx.navigateTo({ url: '/pages/coupon/coupon-list/index' });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const status = e.detail.tabType;

    if (status === 0) {
      wx.navigateTo({ url: '/pages/order/after-service-list/index' });
    } else {
      wx.navigateTo({ url: `/pages/order/order-list/index?status=${status}` });
    }
  },

  jumpAllOrder() {
    wx.navigateTo({ url: '/pages/order/order-list/index' });
  },

  openMakePhone() {
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    this.setData({ showMakePhone: false });
  },

  openChangeLang() {
    this.setData({ showChangeLang: true });
  },

  closeChangeLang() {
    this.setData({ showChangeLang: false });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  changeLangCN() {
    this.changeLang('zh')
  },
  changeLangEN() {
    this.changeLang('en')
  },
  changeLangJP() {
    this.changeLang('jp')
  },
  changeLang(lang){
    console.log('changeLang', lang)
    wx.setStorageSync('language', lang);
    getApp().loadLanguage(lang);
    this.setData({ selectedLanguage: lang });
    wx.showToast({ title: '', icon: 'success' });
    this.setData({ showChangeLang: false });
  },

  gotoUserEditPage() {
    const { currAuthStep } = this.data;
    if (currAuthStep === 2) {
      return;
      // wx.navigateTo({ url: '/pages/usercenter/person-info/index' });
    } else {
      this.fetUseriInfoHandle();
    }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
