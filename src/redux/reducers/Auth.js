import {
    REGISTER_USER,
    LOGIN_ACTION,
    LOGIN_DATA,
    IS_LOADING,
    COINS_STORED,
    IS_SCROLL_DOWN,
    SELECTED_BADGES,
    IMAGES_BOTTOMTAB,
    NOTIFICATIONS,
    RECENT_SEARCHES,
    CONVERSATIONS,
    FOLLOW_REQUESTS
} from '../constants'

let initialState = {
    loading: false,
    loadingResend: false,
    data: {},
    token: '',
    currentUser: null,
    verificationCode: null,
    userSignupDetail: null,
    coinsStored: 0,
    scrollDown: 0,
    selectedBadges: '',
    ImageBottoms: '',
    notifications: [],
    recentSearches: [],
    conversations: [],
    followRequests: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER:
            return {
                ...state,
                currentUser: action.data,
            };
        case LOGIN_ACTION:
            return {
                ...state,
                token: action.data.Token,
            };
        case LOGIN_DATA:
            return {
                ...state,
                currentUser: action.data,
            };
        case IS_LOADING:
            return {
                ...state,
                loading: action.isloading,
            };
        case COINS_STORED:
            return {
                ...state,
                coinsStored: action.data,
            };
        case IS_SCROLL_DOWN:
            return {
                ...state,
                scrollDown: action.data,
            };
        case SELECTED_BADGES:
            return {
                ...state,
                selectedBadges: action.data,
            };
        case IMAGES_BOTTOMTAB:
            return {
                ...state,
                ImageBottoms: action.data,
            }
        case NOTIFICATIONS:
            return {
                ...state,
                notifications: action.data,
            }
        case RECENT_SEARCHES:
            return {
                ...state,
                recentSearches: action.data,
            }
        case CONVERSATIONS:
            return {
                ...state,
                conversations: action.data,
            }
        case FOLLOW_REQUESTS:
            return {
                ...state,
                followRequests: action.data,
            }
        default:
            return state;
    }

}