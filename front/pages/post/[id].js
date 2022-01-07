// post/[id].js
import React from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';

import wrapper from '../../store/configureStore';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POSTS_REQUEST } from '../../reducers/post';

const Post = () => {
  const router = useRouter();
  const { id } = router.query; // router.query.id
  const { singlePost } = useSelector((state) => state.post);

  return (
    <AppLayout>
      <Head>
        <title>{singlePost.User.nickname}님의 게시글</title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
        <meta property="og:url" content={`https://nodebird.com/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { id: '1' } },
//     ],
//     fallback: false,
//   };
// }

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  console.log('getServerSideProps start');
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({
    type: LOAD_POSTS_REQUEST,
    data: store.params.id,
  });
  store.dispatch(END);
  console.log('getServerSideProps end');
  await store.sagaTask.toPromise();
});

export default Post;
