import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './FormPage.scss';
const axios = require('axios');

const FormPage = () => {
    // Ref
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

    // 此人是否在資料庫中
    useEffect(()=>{
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
            // if (window.enableWeXinLogIn) {
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
        <div className="FormPage">
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
                        <input type="text" ref={inputNameDOM} />
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
                        <input type="text" ref={inputSchoolDOM} />
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
                        <input type="text" ref={inputCollegeDOM} />
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
                        <input type="text" ref={inputMajorDOM} />
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
                        <input type="text" ref={inputPhoneDOM} />
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
                        <input type="text" ref={inputMailDOM} />
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