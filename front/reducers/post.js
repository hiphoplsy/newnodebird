import produce from 'immer';
import shortId from 'shortid';
import faker from 'faker';

export const initialState = {
  mainPosts: [],
  hasMorePost: true,
  addPostLoading: false, // 글작성 시도중
  addPostDone: false,
  addPostError: null,
  loadPostsLoading: false, // 작성글들 불러오기 시도중
  loadPostsDone: false,
  loadPostsError: null,
  addCommentLoading: false, // 댓글 작성 시도중
  addCommentDone: false,
  addCommentError: null,
  removePostLoading: false, // 작성글 삭제 시도중
  removePostDone: false,
  removePostError: null,
};

export const generateDummyPost = (number) => Array(number).fill().map(() => ({
  id: shortId.generate(),
  User: {
    id: shortId.generate(),
    nickname: faker.name.findName(),
  },
  content: faker.lorem.paragraph(),
  Images: [{
    src: faker.image.image(),
  }],
  Comments: [{
    id: shortId.generate(),
    User: {
      id: shortId.generate(),
      nickname: faker.name.name(),
    },
    content: faker.lorem.sentence(),
  }],
}));

initialState.mainPosts = initialState.mainPosts.concat(generateDummyPost(10));

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case LOAD_POSTS_REQUEST:
      draft.loadPostsLoading = true;
      draft.loadPostsDone = false;
      draft.loadPostsError = false;
      break;
    case LOAD_POSTS_SUCCESS:
      draft.loadPostsLoading = false;
      draft.loadPostsDone = true;
      draft.mainPosts = action.data(draft.mainPosts);
      draft.hasMorePost = draft.hasMorePost.length > 50;
      break;
    case LOAD_POSTS_FAILURE:
      draft.loadPostsLoading = false;
      draft.loadPostsError = action.error;
      break;
    case ADD_POST_REQUEST:
      draft.addPostLoading = true;
      draft.addPostDone = false;
      draft.addPostError = null;
      break;
    case ADD_POST_SUCCESS:
      draft.addPostLoading = false;
      draft.addPostDone = true;
      draft.mainPosts = draft.mainPosts.unshift(action.data);
      break;
    case ADD_POST_FAILURE:
      draft.addPostLoading = false;
      draft.addPostError = action.error;
      break;
    case ADD_COMMENT_REQUEST:
      draft.addCommentLoading = true;
      draft.addCommentDone = false;
      draft.addCommentError = null;
      break;
    case ADD_COMMENT_SUCCESS:
      draft.addCommentLoading = false;
      draft.addCommentDone = true;
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Comments.unshift(action.data);
      break;
    case ADD_COMMENT_FAILURE:
      draft.addCommentLoading = false;
      draft.addCommentError = action.error;
      break;
    case REMOVE_POST_REQUEST:
      draft.removePostLoading = true;
      draft.removePostDone = false;
      draft.removePostError = null;
      break;
    case REMOVE_POST_SUCCESS:
      draft.removePostLoading = false;
      draft.removePostDone = true;
      draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
      break;
    case REMOVE_POST_FAILURE:
      draft.removePostLoading = false;
      draft.removePostError = action.error;
      break;
    default:
      break;
  }
});

export default reducer;

// mainPosts: [{
//   id: 1,
//   User: {
//     id: 1,
//     nickname: '제로추',
//   },
//   content: '가나다라마바사아',
//   Images: [{
//     src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
//   }, {
//     src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
//   }, {
//     src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
//   }],
//   Comments: [{
//     User: {
//       nickname: 'gke',
//     },
//     content: '가나다라바사',
//   }, {
//     User: {
//       nickname: 'gkr2',
//     },
//     content: '가나다라바',
//   }],
// }],