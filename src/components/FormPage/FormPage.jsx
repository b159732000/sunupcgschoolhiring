import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import wx from 'weixin-js-sdk';
import { GetSignP2, ShareBack, share } from '../../api/api';
import './FormPage.scss';
const axios = require('axios');

const FormPage = () => {
    // Ref
    const thisPageContainerDOM = useRef();
    const inputNameDOM = useRef();
    const inputSchoolDOM = useRef();
    const inputCollegeDOM = useRef();
    const inputMajorDOM = useRef();
    const inputPhoneDOM = useRef();
    const inputMailDOM = useRef();
    // State
    const [submitFinished, setSubmitFinished] = useState(false);
    // Store
    const storeUsrOpenID = useSelector(state => state.myFirstReducers.usrOpenID);
    const storeThisPersonIdIsInDataBase = useSelector(state => state.myFirstReducers.thisPersonIdIsInDataBase);

    useEffect(() => {
        // 將本頁總container高度寫死成px
        setTimeout(function () {
            let viewheight = window.innerHeight;
            let viewwidth = window.innerWidth;
            console.log(viewheight, viewwidth);
            let viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0, maximum-scale=1.0");
        }, 300);

        // 微信分享文字和縮圖
        if (window.enableWeiXinLogIn) {
            weiXinShareTextAndPicture();
        }
    }, [])


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
                    title: "2020深圳骄阳校园招聘", // 分享标题
                    desc: "了解深圳骄阳创意科技2020最新职缺，即时投递履历。", // 分享描述
                    link: 'http://hvr.isunupcg.com/sunupcgschoolhiring/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    // imgUrl: res.msg.imgUrl, // 分享图标
                    imgUrl: 'https://sunupcgschoolhiring.oss-cn-shenzhen.aliyuncs.com/TitleImg1by1.jpg', // 分享图标
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
                    title: "2020深圳骄阳校园招聘", // 分享标题
                    desc: "了解深圳骄阳创意科技2020最新职缺，即时投递履历。", // 分享描述
                    link: 'http://hvr.isunupcg.com/sunupcgschoolhiring/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    // imgUrl: res.msg.imgUrl, // 分享图标
                    imgUrl: 'https://sunupcgschoolhiring.oss-cn-shenzhen.aliyuncs.com/TitleImg1by1.jpg', // 分享图标
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

    // 此人是否在資料庫中
    useEffect(() => {
        if (storeThisPersonIdIsInDataBase) {
            setSubmitFinished(true);
        }
    }, [storeThisPersonIdIsInDataBase])

    // 點選立即提交觸發
    const handleSubmitButtonOnClick = () => {
        pushUserSubmitedData();
    }

    // 上傳使用者輸入資料
    const pushUserSubmitedData = () => {
        let userInputName = inputNameDOM.current.value;
        let userInputSchool = inputSchoolDOM.current.value;
        let userInputCollege = inputCollegeDOM.current.value;
        let userInputMajor = inputMajorDOM.current.value;
        let userInputPhone = inputPhoneDOM.current.value;
        let userInputMail = inputMailDOM.current.value;

        // 檢測所有資料填完與否，全部填完就上傳伺服器
        if (userInputName !== '' && userInputSchool !== '' && userInputCollege !== '' && userInputMajor !== '' && userInputPhone !== '' && userInputMail !== '') {
            console.log('全部資料已輸入')

            // 上傳資料到伺服器
            // if (window.enableWeiXinLogIn) {
            console.log('開始上傳使用者填的資料到伺服器');
            axios('http://hvr.isunupcg.com/sunupcgschoolhiringserver/save.php', {
                params: {
                    openID: storeUsrOpenID,
                    userInputName: userInputName,
                    userInputSchool: userInputSchool,
                    userInputCollege: userInputCollege,
                    userInputMajor: userInputMajor,
                    userInputPhone: userInputPhone,
                    userInputMail: userInputMail,
                    // usrPlanetRadius: usrSettingPlanetRadius,
                    // usrPlanetTone: usrSettingPlanetTone,
                    // usrPlanetMountainHeight: usrSettingPlanetMountainHeight,
                    // usrPlanetMountainDensity: usrSettingPlanetMountainDensity
                }
            }).then(resp => {
                console.log('成功獲得伺服器回應');
                console.log(resp);
                setSubmitFinished(true);
            })
            // }

        } else {
            console.log('有資料尚未輸入')
            window.alert('请将资料填写完整');
        }
    }

    // 從輸入框移開時觸發
    const handleInputFocusOut = () => {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            // window.addEventListener('focusout', function () {
            //软键盘收起的事件处理
            setTimeout(() => {
                window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop);
            })
            // });
        }
    }

    return (
        <div className="FormPage" ref={thisPageContainerDOM}>
            <div className="bg">
                <img src={require('../../images/InnerPageSwiper/7/Bg.jpg')} alt="" />
            </div>
            {/* 创建简历 */}
            <div className={(!submitFinished) ? ("titlePositioner") : ("titlePositioner hide")}>
                <div className="text">创建简历</div>
            </div>
            {/* 表格 */}
            <div className={(!submitFinished) ? ("formPositioner") : ("formPositioner hide")}>
                {/* 每一行輸入行 */}
                <div className='line'>
                    {/* 左側標題 */}
                    <div className="left">
                        <div className="titleContainer">姓名</div>
                    </div>
                    {/* 右側輸入框 */}
                    <div className="right">
                        <input type="text" ref={inputNameDOM} onBlur={() => handleInputFocusOut()} />
                    </div>
                </div>
                {/* 每一行輸入行 */}
                <div className='line'>
                    {/* 左側標題 */}
                    <div className="left">
                        <div className="titleContainer">学校</div>
                    </div>
                    {/* 右側輸入框 */}
                    <div className="right">
                        <input type="text" ref={inputSchoolDOM} onBlur={() => handleInputFocusOut()} />
                    </div>
                </div>
                {/* 每一行輸入行 */}
                <div className='line'>
                    {/* 左側標題 */}
                    <div className="left">
                        <div className="titleContainer">学院</div>
                    </div>
                    {/* 右側輸入框 */}
                    <div className="right">
                        <input type="text" ref={inputCollegeDOM} onBlur={() => handleInputFocusOut()} />
                    </div>
                </div>
                {/* 每一行輸入行 */}
                <div className='line'>
                    {/* 左側標題 */}
                    <div className="left">
                        <div className="titleContainer">专业</div>
                    </div>
                    {/* 右側輸入框 */}
                    <div className="right">
                        <input type="text" ref={inputMajorDOM} onBlur={() => handleInputFocusOut()} />
                    </div>
                </div>
                {/* 每一行輸入行 */}
                <div className='line'>
                    {/* 左側標題 */}
                    <div className="left">
                        <div className="titleContainer">手机号码</div>
                    </div>
                    {/* 右側輸入框 */}
                    <div className="right">
                        <input type="text" ref={inputPhoneDOM} onBlur={() => handleInputFocusOut()} />
                    </div>
                </div>
                {/* 每一行輸入行 */}
                <div className='line'>
                    {/* 左側標題 */}
                    <div className="left">
                        <div className="titleContainer">邮箱</div>
                    </div>
                    {/* 右側輸入框 */}
                    <div className="right">
                        <input type="text" ref={inputMailDOM} onBlur={() => handleInputFocusOut()} />
                    </div>
                </div>
            </div>
            {/* 提交成功 */}
            <div className={(submitFinished) ? ("submitSuccessful") : ("submitSuccessful hide")}>
                <img src={require('../../images/InnerPageSwiper/SubmitPage/SubmitSuccessful.png')} alt="" />
            </div>
            {/* 提交鈕 */}
            <div className={(!submitFinished) ? ("submitButtonPositioner") : ("submitButtonPositioner hide")}>
                <img onClick={() => handleSubmitButtonOnClick()} src={require('../../images/InnerPageSwiper/FormPage/SubmitButton.png')} alt="" />
            </div>
        </div>
    )
}

export default FormPage;