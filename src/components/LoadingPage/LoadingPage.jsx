import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './LoadingPage.scss';

const LoadingPage = () => {
    // State
    const [allowThisPageHide, setAllowThisPageHide] = useState(false);      //允許此頁隱藏的前置條件(已從資料庫得知是否有此人的open_id在資料庫中才允許)
    const [loadingBarFinished, setLoadingBarFinished] = useState(false);    //進度條是否達100%
    const [loadingFinished, setLoadingFinished] = useState(false);          //此頁是否隱藏
    // Store
    const storeThisPersonIdIsInDataBase = useSelector(state => state.myFirstReducers.thisPersonIdIsInDataBase);

    useEffect(() => {
        if (window.loadingPageIsOn) {
            setTimeout(() => {
                setLoadingBarFinished(true);
            }, 1500)
        } else {
            setLoadingBarFinished(true);
        }
    }, [])

    useEffect(() => {
        // 如果已經取得資料庫中是否有此人的訊息，則允許隱藏本載入頁
        if (storeThisPersonIdIsInDataBase !== null) {
            setAllowThisPageHide(true);
        }
    }, [storeThisPersonIdIsInDataBase])

    // 判斷是否隱藏此頁 (需要達成兩條件: 全部載入完成&&已從資料庫得知是否有此人的open_id在資料庫中)
    useEffect(() => {
        if (loadingBarFinished && allowThisPageHide) {
            setLoadingFinished(true);
        }
    }, [allowThisPageHide, loadingBarFinished])

    return (
        <div className={(!loadingFinished) ? ("LoadingPage") : ("LoadingPage hide")}>
            <div className="bg">
                <img src={require('../../images/InnerPageSwiper/7/Bg.jpg')} alt="" />
            </div>
            <div className="hireLogo">
                <img src={require('../../images/LoadingPage/HireLogo.png')} alt="" />
            </div>
            <div className="bottomPositioner">
                <div className="upper">
                    <img src={require('../../images/InnerPageSwiper/1/TitleImg.png')} alt="" />
                </div>
                <div className="bottom">
                    <img src={require('../../images/LoadingPage/1.png')} alt="" />
                </div>
            </div>
        </div>
    )
}

export default LoadingPage;