import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import './InnerPageSwiper.scss';

const InnerPageSwiper = () => {
    useEffect(() => {
    }, [])

    // Swiper區域
    const [swiper, updateSwiper] = useState();
    const goNext = () => {
        if (swiper !== null) {
            swiper.slideNext();
        }
    }
    const goPrev = () => {
        if (swiper !== null) {
            swiper.slidePrev();
        }
    }
    const goToSlideNumber = (selectedNumber) => {
        if (swiper !== null) {
            swiper.slideTo(selectedNumber - 1);
        }
    }
    // 定義swiperRef為一個容器，可裝載任何東西
    const swiperRef = useRef();
    // 每次畫面有東西更新時，都會將最新的swiper放進這個容器中
    swiperRef.current = swiper;
    // 當slide更換時觸發
    const handleSlideChange = () => {
        let activeSlideNumber = swiperRef.current.activeIndex + 1;
        console.log(activeSlideNumber);
        if (activeSlideNumber <= 3) {
            // setCurrentActivationMenu('City');
        } else if (activeSlideNumber > 3) {
            // setCurrentActivationMenu('Project');
        }
    }
    // swiper設定
    const swiperParams = {
        direction: 'vertical',
        wrapperClass: 'swiperWrapper',
        on: {
            // 'slideChange': () => { handleSlideChange() }
        }
    }
    // 在DOM中添加好幾頁swiper(透過for迴圈)
    let renderImages = () => {
        // 最終要渲染到dom中的item數列
        let items = [];
        // 重複push到items中
        for (let i = 1; i <= 3; i++) {
            items.push(
                <div key={i}>
                    {/* <img src={require('../../images/ThreeDimention/Book/' + i + '.jpg')} alt="" /> */}
                </div>
            )
        }
        // 將結果返回
        return (items);
    }

    return (
        <div className="InnerPageSwiper">
            {/* swiper */}
            <div className='innerPageSwiperSelf'>
                {/* 在css中叫做swiper-container */}
                <Swiper {...swiperParams} getSwiper={updateSwiper}>
                    {/* {renderImages()} */}
                    {/* 每1頁 */}
                    <div>
                        {/* 背景 */}
                        <div className="bg">
                            <img className='bgImg' src={require('../../images/InnerPageSwiper/InnerSwiperBg.jpg')} alt="" />
                        </div>
                        {/* 本頁內容 */}
                        <div className="thisPageInnerContainer">
                            <div className="innerContent">
                                <img src={require('../../images/InnerPageSwiper/1/InnerContent.png')} alt="" />
                            </div>
                        </div>
                    </div>
                    {/* 每2頁 */}
                    <div>
                        {/* 背景 */}
                        <div className="bg left">
                            <img className='bgImg' src={require('../../images/InnerPageSwiper/InnerSwiperBg.jpg')} alt="" />
                        </div>
                        {/* 本頁內容 */}
                        <div className="thisPageInnerContainer">
                            <div className="innerContent">
                                <img src={require('../../images/InnerPageSwiper/2/InnerContent.png')} alt="" />
                            </div>
                        </div>
                    </div>
                    {/* 每3頁 */}
                    <div>
                        {/* 背景 */}
                        <div className="bg left">
                            <img className='bgImg' src={require('../../images/InnerPageSwiper/InnerSwiperBg.jpg')} alt="" />
                        </div>
                        {/* 本頁內容 */}
                        <div className="thisPageInnerContainer">
                            {/* 本頁內容 */}
                            <div className="innerContent">
                                <img src={require('../../images/InnerPageSwiper/3/InnerContent.png')} alt="" />
                            </div>
                        </div>
                    </div>
                    {/* 每4頁 */}
                    <div>
                        {/* 背景 */}
                        <div className="bg left">
                            <img className='bgImg' src={require('../../images/InnerPageSwiper/InnerSwiperBg.jpg')} alt="" />
                        </div>
                        {/* 本頁內容 */}
                        <div className="thisPageInnerContainer">
                            {/* 本頁內容 */}
                            <div className="innerContent">
                                <img src={require('../../images/InnerPageSwiper/4/InnerContent.png')} alt="" />
                            </div>
                        </div>
                    </div>
                    {/* 每5頁 */}
                    <div>
                        {/* 背景 */}
                        <div className="bg left">
                            <img className='bgImg' src={require('../../images/InnerPageSwiper/InnerSwiperBg.jpg')} alt="" />
                        </div>
                        {/* 本頁內容 */}
                        <div className="thisPageInnerContainer">
                            {/* 本頁內容 */}
                            <div className="innerContent">
                                <img src={require('../../images/InnerPageSwiper/5/InnerContent.png')} alt="" />
                            </div>
                        </div>
                    </div>
                    {/* 每6頁 */}
                    <div>
                        {/* 背景 */}
                        <div className="bg left">
                            <img className='bgImg' src={require('../../images/InnerPageSwiper/InnerSwiperBg.jpg')} alt="" />
                        </div>
                        {/* 本頁內容 */}
                        <div className="thisPageInnerContainer">
                            {/* 本頁內容 */}
                            <div className="innerContent">
                                <img src={require('../../images/InnerPageSwiper/6/InnerContent.png')} alt="" />
                            </div>
                        </div>
                    </div>
                    {/* 每7頁(封底) */}
                    <div className='lastPage'>
                        {/* 背景 */}
                        <div className="bg left">
                            <img className='bgImg' src={require('../../images/InnerPageSwiper/7/Bg.jpg')} alt="" />
                        </div>
                        {/* 本頁內容 */}
                        <div className="lastPageInnerContainer">
                            {/* Join us 標題 */}
                            <div className="titlePositioner">
                                <img src={require('../../images/InnerPageSwiper/7/TitleText.png')} alt="" />
                            </div>
                            {/* 按鈕 */}
                            <Link className="buttonPositioner" to="/sunupcgschoolhiring/FormPage">
                                <div className="buttonContainer">
                                    <div className="button">
                                        <img src={require('../../images/InnerPageSwiper/7/ButtonIcon.png')} alt=""/>
                                    </div>
                                    <div className="text">
                                        <img src={require('../../images/InnerPageSwiper/7/ClickToJoinText.png')} alt=""/>
                                    </div>
                                </div>
                            </Link>
                            {/* 驕陽Logo */}
                            <div className="logoPositioner">
                                <img src={require('../../images/InnerPageSwiper/1/TitleImg.png')} alt="" />
                            </div>
                        </div>
                    </div>
                </Swiper>
            </div>
        </div>
    )
}

export default InnerPageSwiper;