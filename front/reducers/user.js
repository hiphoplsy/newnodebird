import produce from 'immer';

export const initialState = {
  me: null, // 내정보
  userInfo: null, // 유저정보
  loginLoading: false, // 로그인 시도중
  loginDone: false,
  loginError: null,
  logoutLoading: false, // 로그아웃 시도중
  logoutDone: false,
  logoutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  changeNicknameLoading: false, // 닉네임 수정 시도중
  changeNicknameDone: false,
  changeNicknameError: null,
  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,
  loadMyInfoLoading: false, // 내정보 불러오기 시도중
  loadMyInfoDone: false,
  loadMyInfoError: null,
  loadUserLoading: false, // 유저정보 불러오기 시도중
  loadUserDone: false,
  loadUserError: null,
  loadFollowingsLoading: false, // 팔로잉목록 불러오기 시도중
  loadFollowingsDone: false,
  loadFollowingsError: null,
  loadFollowersLoading: false, // 팔로워목록 불러오기 시도중
  loadFollowersDone: false,
  loadFollowersError: null,
  removeFollowerLoading: false, // 팔로워 삭제 시도중
  removeFollowerDone: false,
  removeFollowerError: null,
};

// const dummyUser = (data) => ({
//   ...data,
//   id: 1,
//   nickname: '제로',
//   Posts: [],
//   Followings: [{ nickname: 'zero' }, { nickname: 'zero1' }, { nickname: 'zero3' }],
//   Followers: [{ nickname: 'zero' }, { nickname: 'zero1' }, { nickname: 'zero3' }],
// });

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case LOAD_MY_INFO_REQUEST:
      draft.loadMyInfoLoading = true;
      draft.loadMyInfoDone = false;
      draft.loadMyInfoError = null;
      break;
    case LOAD_MY_INFO_SUCCESS:
      draft.loadMyInfoLoading = false;
      draft.loadMyInfoDone = true;
      draft.me = action.data;
      break;
    case LOAD_MY_INFO_FAILURE:
      draft.loadMyInfoLoading = false;
      draft.loadMyInfoError = action.error;
      break;
    case LOAD_USER_REQUEST:
      draft.loadUserLoading = true;
      draft.loadUserDone = false;
      draft.loadUserError = null;
      break;
    case LOAD_USER_SUCCESS:
      draft.loadUserLoading = false;
      draft.loadUserDone = true;
      draft.userInfo = action.data;
      break;
    case LOAD_USER_FAILURE:
      draft.loadUserLoading = false;
      draft.loadUserError = action.error;
      break;
    case LOGIN_REQUEST:
      draft.loginLoading = true;
      draft.loginDone = false;
      draft.loginError = null;
      break;
    case LOGIN_SUCCESS:
      draft.loginLoading = false;
      draft.loginDone = true;
      draft.me = action.data;
      break;
    case LOGIN_FAILURE:
      draft.loginLoading = false;
      draft.loginError = action.error;
      break;
    case LOGOUT_REQUEST:
      draft.logoutLoading = true;
      draft.logoutDone = false;
      draft.logoutError = null;
      break;
    case LOGOUT_SUCCESS:
      draft.logoutLoading = false;
      draft.logoutDone = true;
      draft.me = null;
      break;
    case LOGOUT_FAILURE:
      draft.logoutLoading = false;
      draft.logoutError = action.error;
      break;
    case SIGN_UP_REQUEST:
      draft.signUpLoading = true;
      draft.signUpDone = false;
      draft.signUpError = null;
      break;
    case SIGN_UP_SUCCESS:
      draft.signUpLoading = false;
      draft.signUpDone = true;
      break;
    case SIGN_UP_FAILURE:
      draft.signUpLoading = false;
      draft.signUpError = action.error;
      break;
    case CHANGE_NICKNAME_REQUEST:
      draft.changeNicknameLoading = true;
      draft.changeNicknameDone = false;
      draft.changeNicknameError = null;
      break;
    case CHANGE_NICKNAME_SUCCESS:
      draft.changeNicknameLoading = false;
      draft.changeNicknameDone = true;
      draft.me.nickname = action.data.nickname;
      break;
    case CHANGE_NICKNAME_FAILURE:
      draft.changeNicknameLoading = false;
      draft.changeNicknameError = action.error;
      break;
    case FOLLOW_REQUEST:
      draft.followLoading = true;
      draft.followDone = false;
      draft.followError = null;
      break;
    case FOLLOW_SUCCESS:
      draft.followLoading = false;
      draft.followDone = true;
      draft.me.Followings.push({ id: action.data.UserId });
      break;
    case FOLLOW_FAILURE:
      draft.followLoading = false;
      draft.followError = action.error;
      break;
    case UNFOLLOW_REQUEST:
      draft.unfollowLoading = true;
      draft.unfollowDone = false;
      draft.unfollowError = null;
      break;
    case UNFOLLOW_SUCCESS:
      draft.unfollowLoading = false;
      draft.unfollowDone = true;
      draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data.UserId);
      break;
    case UNFOLLOW_FAILURE:
      draft.unfollowLoading = false;
      draft.unfollowError = action.error;
      break;
    case LOAD_FOLLOWINGS_REQUEST:
      draft.loadFollowingsLoading = true;
      draft.loadFollowingsDone = false;
      draft.loadFollowingsError = null;
      break;
    case LOAD_FOLLOWINGS_SUCCESS:
      draft.loadFollowingsLoading = true;
      draft.loadFollowingsDone = false;
      draft.me.Followings = action.data;
      break;
    case LOAD_FOLLOWINGS_FAILURE:
      draft.loadFollowingsLoading = true;
      draft.loadFollowingsError = null;
      break;
    case LOAD_FOLLOWERS_REQUEST:
      draft.loadFollowersLoading = true;
      draft.loadFollowersDone = false;
      draft.loadFollowersError = null;
      break;
    case LOAD_FOLLOWERS_SUCCESS:
      draft.loadFollowersLoading = true;
      draft.loadFollowersDone = false;
      draft.me.Followers = action.data;
      break;
    case LOAD_FOLLOWERS_FAILURE:
      draft.loadFollowersLoading = true;
      draft.loadFollowersError = null;
      break;
    case REMOVE_FOLLOWER_REQUEST:
      draft.removeFollowerLoading = true;
      draft.removeFollowerDone = false;
      draft.removeFollowerError = null;
      break;
    case REMOVE_FOLLOWER_SUCCESS:
      draft.removeFollowerLoading = true;
      draft.removeFollowerDone = false;
      draft.me.Followers = draft.me.Followers.filter((v) => v.id !== action.data.UserId);
      break;
    case REMOVE_FOLLOWER_FAILURE:
      draft.removeFollowerLoading = true;
      draft.removeFollowerError = null;
      break;
    case ADD_POST_TO_ME:
      draft.me.Posts.unshift({ id: action.data });
      break;
    case REMOVE_POST_OF_ME:
      draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data);
      break;
    default:
      break;
  }
});

export default reducer;
