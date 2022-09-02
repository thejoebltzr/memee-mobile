import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from './AxiosInit';
import Toast from 'react-native-toast-message';
import {urls} from './urls';

API.interceptors.request.use(
  config => {
    config.timeout = 5000;
    if (global?.token) {
      config.headers.authToken = global.token;
    }
    config.headers['Content-Type'] = 'application/json';
    config.headers.accept = 'application/json';
    return config;
  },
  error => Promise.reject(error),
);

export const GetNotificationApi = async id => {
  try {
    const res = await API.get(`${urls.getNotifications}/${id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

export const ReadNotificationApi = async id => {
  try {
    const res = await API.post(`${urls.readNotifications}/${id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

export const ToggleOnlineStatusApi = async (id, val) => {
  try {
    const res = await API.get(`${urls.toggleOnlineStatus}/${id}/val`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/ActivityNotification
export const ShowFollowRequestFNApi = async id => {
  try {
    const res = await API.get(`GetFollowRequests/${id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/AddCoins
export const ShowPurchaseHistoryApi = async id => {
  try {
    const res = await API.get(`GetTransactionsHistory/${id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/ChatScreen
export const GetConversationApi = async (conversationId, offset) => {
  try {
    const res = await API.get(`getConversation/${conversationId}/${offset}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/ChatScreen
export const SendMessageApi = async data => {
  try {
    const res = await API.post(`sendMessage`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/CommentScreen
export const GetPostDataFNApi = async postId => {
  try {
    const res = await API.get(`GetPostComments/${postId}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/Dashboard
export const SaveTokenToDatabaseApi = (id, deviceToken) => {
  try {
    const res = await API.get(`updateDeviceToken/${id}/${deviceToken}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/Dashboard
export const GetPostsApi = (postApiName, id, offset, limit) => {
  try {
    const res = await API.get(`${postApiName}/${id}/${offset}/${limit}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/Dashboard and exploreDetail and ProfileImageShow
export const LikeOrUnlikeFNApi = data => {
  try {
    const res = await API.post(`reactToPost`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/Dashboard
export const DeleteMemeeFNApi = postIdToDelete => {
  try {
    const res = await API.get(`DeletePost/${postIdToDelete}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/EditProfileScreen
export const SaveChangesApi = data => {
  try {
    const res = await API.post(`UpdateProfile`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// screens/exploreScreen
export const SearchFNApi = text => {
  try {
    const res = await API.get(`SearchTop/${text}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/FollowRequest
export const ShowSuggwsionRequestFNApi = id => {
  try {
    const res = await API.get(`RequestSuggessions/${id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/FollowRequest
export const SendFollowRequestApi = data => {
  try {
    const res = await API.post(`PostFollowRequest`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screens/FollowRequest
export const ConfirmRequesApi = (follow_id, user_id, following_id) => {
  try {
    const res = await API.get(
      `ConfirmFollowRequest/${follow_id}/${user_id}/${following_id}`,
    );
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screen/ForgetPassword
export const GetOTPToReset = body => {
  try {
    const res = await API.post(`SendOTP`, body);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

// Screen/Inbox
export const GetConversationsApi = user_id => {
  try {
    const res = await API.get(`getConversations/${user_id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/JudgeMeme
export const GetJudgePostFNApi = user_id => {
  try {
    const res = await API.post(`GetPostsForJudgement/${user_id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/JudgeMeme
export const JudgeReactFNApi = data => {
  try {
    const res = await API.post(`JudgePost`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/JudgeScreen
export const GetJudgePostFNScreenApi = user_id => {
  try {
    const res = await API.post(`JudgeHistory/${user_id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/LoginScreen
export const ValidationApi = data => {
  try {
    const res = await API.post(`login`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/LoginScreen
export const LoginDataApi = data => {
  try {
    const res = await API.post(`getLoggedInUser`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/NewMessage
export const UserListShowFNApi = user_id => {
  try {
    const res = await API.get(`GetFollowedUsersList/${user_id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/NewMessage
export const OpenChatApi = users => {
  try {
    const res = await API.post(`createConversation`, users);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/NewPassword
export const ResetPasswordApi = data => {
  try {
    const res = await API.post(`UpdatePassword`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/NewPost
export const PostUploadFNApi = data => {
  try {
    const res = await API.post(`AddPost`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/OrganizeBadges
export const GetEarnedBadgesApi = user_id => {
  try {
    const res = await API.get(`GetBadges/${user_id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/OrganizeBadges
export const GetProgressBadgeApi = user_id => {
  try {
    const res = await API.get(`GetBadgesProgress/${user_id}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/OrganizeBadges
export const SelectBadgesToShowApi = data => {
  try {
    const res = await API.post(`OrganizeBadges`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/ProfileScreen
export const GetOrganizedBadgesFNApi = profileID => {
  try {
    const res = await API.get(`GetOrganizedBadges/${profileID}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/ProfileScreen
export const ProfileDataFNApi = profileID => {
  try {
    const res = await API.get(`GetUserProfile/${profileID}`);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/ProfileScreen
export const UpdateProfileFNApi = data => {
  try {
    const res = await API.post(`UpdateProfile`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};

//Screens/ProfileScreen
export const CancelFollowRequestApi = (user_id, profileID) => {
  try {
    const res = await API.post(`UnfollowUser/${user_id}/${profileID}`, data);
    return res;
  } catch (e) {
    console.error(Object.keys(e), e.message);
    throw new Error(e.message);
  }
};
