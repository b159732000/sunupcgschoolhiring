import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import wx from 'weixin-js-sdk';
import LoadingPage from './components/LoadingPage/LoadingPage.jsx';
import InnerPageSwiper from './components/InnerPageSwiper/InnerPageSwiper.jsx';
import FormPage from './components/FormPage/FormPage.jsx';
import { GetSignP2, ShareBack, share } from './api/api';
import './App.scss';
import {
  updateUsrOpenID,
  updateFromServerUsrName,
  updateFromServerUsrPlanetRadius,
  updateFromServerPlanetTone,
  updateFromServerUsrPlanetMountainHeight,
  updateFromServerUsrPlanetMountainDensity,
  updateFromServerUsrWorkDays,
  updateLotteryNumber,
  updateThisPersonIsInDataBase
} from './actions/actions.js';
const axios = require('axios');

// 重新導向獲得微信授權(Code)，有Code後在把Code傳給後端取得微信ID
let AppID = 'wx0db0332b2e95ff0e';   //公眾號ID
let local = window.location.href;   //目前網頁的網址
let weXinJumpCode;
let weXinOpenID;

function App(props) {
  // Store
  const storeUsrOpenID = useSelector(state => state.myFirstReducers.usrOpenID);
  const storeFromServerUsrPlanetRadius = useSelector(state => state.myFirstReducers.fromServerUsrPlanetRadius);
  const storeFromServerUsrPlanetTone = useSelector(state => state.myFirstReducers.fromServerUsrPlanetTone);
  const storeFromServerUsrPlanetMountainHeight = useSelector(state => state.myFirstReducers.fromServerUsrPlanetMountainHeight);
  const storeFromServerUsrPlanetMountainDensity = useSelector(state => state.myFirstReducers.fromServerUsrPlanetMountainDensity);
  const storeLoadingPageMounted = useSelector(state => state.myFirstReducers.loadingPageMounted);
  const storeIntroPageMounted = useSelector(state => state.myFirstReducers.introPageMounted);
  const storeFinalPageMounted = useSelector(state => state.myFirstReducers.finalPageMounted);
  const storeLotteryNumber = useSelector(state => state.myFirstReducers.lotteryNumber);
  const storeBgAlignToRight = useSelector(state => state.myFirstReducers.bgAlignToRight);
  const storeThisPersonIdIsInDataBase = useSelector(state => state.myFirstReducers.thisPersonIdIsInDataBase);
  // Dispatch
  const dispatch = useDispatch();
  const storeUpdateUsrOpenID = (value) => dispatch(updateUsrOpenID(value));
  const storeUpdateFromServerUsrName = (value) => dispatch(updateFromServerUsrName(value));
  const storeUpdateFromServerUsrPlanetRadius = (value) => dispatch(updateFromServerUsrPlanetRadius(value));
  const storeUpdateFromServerPlanetTone = (value) => dispatch(updateFromServerPlanetTone(value));
  const storeUpdateFromServerUsrPlanetMountainHeight = (value) => dispatch(updateFromServerUsrPlanetMountainHeight(value));
  const storeUpdateFromServerUsrPlanetMountainDensity = (value) => dispatch(updateFromServerUsrPlanetMountainDensity(value));
  const storeUpdateFromServerUsrWorkDays = (value) => dispatch(updateFromServerUsrWorkDays(value));
  const storeUpdateLotteryNumber = (value) => dispatch(updateLotteryNumber(value));
  const storeUpdateThisPersonIsInDataBase = (value) => dispatch(updateThisPersonIsInDataBase(value));

  // 如果有微信openID，就向伺服器要使用者設定的星球資訊、使用者在職日數、姓名，並放入store中
  useEffect(() => {
    console.log(storeUsrOpenID);
    if (storeUsrOpenID === '' || storeUsrOpenID === null) {
      // 沒有微信ID，则做出一颗基本星球，并跳到finalPage往上滑后
    } else {
      console.log("調用函數: {用微信ID項資料庫取得數據}")
      // 用微信ID項資料庫取得數據，並放入store中
      connectAndGetDataFromDataBase();

      // 若微信ID沒取得資料庫的數據，則設定store此人不在資料庫中
    }
  }, [storeUsrOpenID])

  // 如果此人在資料庫中，則跳轉到FormPage，並由FormPage的邏輯直接顯示結束畫面
  useEffect(()=>{
    if(storeThisPersonIdIsInDataBase) {
      props.history.push('/sunupcgschoolhiring/FormPage');
    }
  }, [storeThisPersonIdIsInDataBase])

  useEffect(() => {
    // 取得微信openID放到store
    if (window.enableWeXinLogIn) {
      // 重新導向獲得微信授權(Code)，有Code後在把Code傳給後端取得微信ID放到store
      getWeXinOpenIDFromWexin();
    } else {
      // 傳我的微信openID到store中
      storeUpdateUsrOpenID('oRbr0w4RNYkdxuBZvkB5oUxI7QkQ');
    }

    // 如果有微信openID，就向伺服器要使用者設定的星球資訊、使用者在職日數、姓名，並放入store中
    // setTimeout(() => {
    //   if (storeUsrOpenID === '' || storeUsrOpenID === null) {
    //     // 沒有微信ID，则做出一颗基本星球，并跳到finalPage往上滑后

    //   } else {
    //     console.log("調用函數: {用微信ID項資料庫取得數據}")
    //     // 用微信ID項資料庫取得數據，並放入store中
    //     connectAndGetDataFromDataBase();

    //     // 若微信ID沒取得資料庫的數據，則設定store此人不在資料庫中

    //   }
    // }, 500)

    // 微信分享文字和縮圖
    if (window.enableWeiXinLogIn) {
      weiXinShareTextAndPicture();
    }
  }, [])

  // 取得微信ID，並放入Store中
  const getWeXinOpenIDFromWexin = () => {
    // 看一看網址中是否有微信跳轉code
    weXinJumpCode = getUrlPropertyAndValue('code');

    // 依照剛才看一看的結果，決定要跳轉去取code或直接拿code跟服務器拿openid
    if (weXinJumpCode == null || weXinJumpCode === '') {
      console.log("沒有微信openID，正在轉址");
      console.log('跳轉到網址: https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect')

      // 跳轉到微信取得授權網頁
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
    } else {
      console.log("有微信授權Code，開始向後台取得openID。  微信授權Code:" + weXinJumpCode);

      // 利用微信授權Code向伺服器取得openID
      axios('http://hvr.isunupcg.com/year2019/requestWeXinID.php', {
        params: {
          code: weXinJumpCode
        }
      }).then(resp => {
        let thisOpenID = resp.data[0].openID;

        // 在redux中更新openID，並顯示在console
        storeUpdateUsrOpenID(thisOpenID);
        console.log(thisOpenID);
        setTimeout(() => {
          console.log(storeUsrOpenID);
        }, 1000)
      })
    }
  }

  // 取得網址字串
  const getUrlPropertyAndValue = (property) => {
    // 取得網址
    let getUrlString = window.location.href;

    // 將網址字串轉成URL
    let url = new URL(getUrlString);

    // 使用URL.searchParams + get 函式  (括弧裡面帶入欲取得結果的KEY鍵值參數)
    let result = url.searchParams.get(property);
    return result;
  }

  // 用微信ID項資料庫取得數據
  const connectAndGetDataFromDataBase = () => {
    console.log('開始用微信openID向資料庫取得用戶的其他資訊');
    // if (window.enableWeiXinLogIn) {
    console.log(storeUsrOpenID);
    // 驗證openID是否在資料庫中
    axios('http://hvr.isunupcg.com/sunupcgschoolhiringserver/thisPersonIsInDataBase.php', {
      params: {
        openID: storeUsrOpenID
      },
      crossDomain: true
    }).then(resp => {
      console.log(resp.data);
      if (resp.data) {
        // 此人在資料庫中
        storeUpdateThisPersonIsInDataBase(true);
        // axios('http://hvr.isunupcg.com/year2019/contacts.php', {
        //   params: {
        //     openID: storeUsrOpenID
        //   },
        //   crossDomain: true
        // }).then(resp => {
        //   console.log(resp.data.user);
        //   console.log('成功得到用戶自訂星球訊息、在職天數、姓名');
        //   console.log('將取得的用戶訊息放入store中');
        //   storeUpdateFromServerUsrName(resp.data.user[0].name);
        //   storeUpdateFromServerUsrPlanetRadius(resp.data.user[0].planetRadius);
        //   storeUpdateFromServerPlanetTone(resp.data.user[0].planetTone);
        //   storeUpdateFromServerUsrPlanetMountainHeight(resp.data.user[0].planetMountainHeight);
        //   storeUpdateFromServerUsrPlanetMountainDensity(resp.data.user[0].planetMountainDensity);
        //   storeUpdateFromServerUsrWorkDays(resp.data.user[0].workDays);
        //   storeUpdateLotteryNumber(resp.data.user[0].lotteryNumber);
        // })
      } else {
        console.log('伺服器說此人openid不在資料庫中，從伺服器回傳的值為:' + resp);
        // 此人不再資料庫中
        storeUpdateThisPersonIsInDataBase(false);
      }
    })
    // } else {
    //   // console.log('因為關閉微信驗證功能，所以在app.js中直接將此人設定成不在資料庫中，並記錄在store');
    //   // this.props.updateThisPersonIsInDataBase(false);

    //   console.log('這是在測試模式，開始手動設定serverUsrName (有usrName才能結束載入頁)')
    //   storeUpdateFromServerUsrName('測試模式');
    //   storeUpdateFromServerUsrWorkDays('777');
    // };
  }

  // 微信分享文字和縮圖
  const weiXinShareTextAndPicture = () => {
    GetSignP2({ url: window.location.href }).then(res => {
      console.log(res);
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.msg.appId, // 必填，公众号的唯一标识
        timestamp: res.msg.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.msg.nonceStr, // 必填，生成签名的随机串
        signature: res.msg.signature, // 必填，签名，见附录1
        jsApiList: ["showMenuItems", "onMenuShareTimeline", "onMenuShareAppMessage", "updateAppMessageShareData", "updateTimelineShareData"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: ["showMenuItems"],
          success: function (res) {
            wx.showMenuItems({
              menuList: [
                "menuItem:share:appMessage",
                "menuItem:share:timeline"
              ]
            });
          }
        });
        wx.onMenuShareTimeline({ ////朋友圈
          title: "2019深圳骄阳校园招聘", // 分享标题
          desc: "了解深圳骄阳创意科技2019最新职缺，即时投递履历。", // 分享描述
          link: 'http://hvr.isunupcg.com/sunupcgschoolhiring/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          // imgUrl: res.msg.imgUrl, // 分享图标
          imgUrl: 'https://sunupcgschoolhiring.oss-cn-shenzhen.aliyuncs.com/TitleImg.png', // 分享图标
          success: function (res) {
            console.log(res);
            // 用户确认分享后执行的回调函数
            console.log("分享成功！！！");
            // ShareBack({ share_id: _shareid, share_url: _href + '&s=2' }).then(res => {
            // })
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            console.log("取消分享！！！");
          }
        });
        wx.onMenuShareAppMessage({ //朋友
          title: "2019深圳骄阳校园招聘", // 分享标题
          desc: "了解深圳骄阳创意科技2019最新职缺，即时投递履历。", // 分享描述
          link: 'http://hvr.isunupcg.com/sunupcgschoolhiring/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          // imgUrl: res.msg.imgUrl, // 分享图标
          imgUrl: 'https://sunupcgschoolhiring.oss-cn-shenzhen.aliyuncs.com/TitleImg.png', // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            console.log("分享成功！！！");
            // ShareBack({ share_id: _shareid, share_url: _href + '&s=1' }).then(res => { })
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            console.log("取消分享！！！");
          }
        });
      })
    })
  }

  return (
    <div className="App">

      <LoadingPage></LoadingPage>

      <Route render={(location) => (
        <Switch>
          <Route exact path='/sunupcgschoolhiring' exact component={InnerPageSwiper} />
          <Route exact path='/sunupcgschoolhiring/FormPage' component={FormPage} />
        </Switch>
      )} />
    </div>
  );
}

export default App;
