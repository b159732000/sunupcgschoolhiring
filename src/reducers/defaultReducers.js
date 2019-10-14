const initialState = {
    currentPageInNavigationLevel: "HomePage",    //目前所在頁面 (導行列層級)
    pageIDlist: {//页面对应的page_id
        'HomePage': 36,//室内户型
        'BrandIntroduction': 37, // 
        'Traffic': 38,// 
        'ThreeDimention': 39,
        'HouseStyle': 40,
        'GardenTraveling': 41,
        'InHouseTraveling': 42,
        'City': 43,
        'Project': 44,
        'Location': 45,
        'FullLocation': 46,
        'FullProject': 47,
        'FirstOpen': 48,
        '102': 49,
        '127': 50
    },
    sceneId: '', //当前所处场景的ID
    user_type: '',//当前的用户 的身份
}

export default function defaultReducers(state = initialState, action) {
    switch (action.type) {
        // 更新目前所在頁面 (導行列層級)
        case 'CHANGECURRENTPAGEINNAVIGATIONLEVEL':
            return {
                ...state,
                currentPageInNavigationLevel: action.value,
            }

        case 'CHANGESCENEID': {
            return {
                ...state,
                sceneId: action.value
            }
        }
        default:
            return state
    }
}