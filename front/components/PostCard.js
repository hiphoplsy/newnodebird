import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Popover, Button, Avatar, List, Comment, Modal, Input, message } from 'antd';
import { HeartTwoTone, RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';

import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST, UPDATE_POST_REQUEST, REPORT_POST_REQUEST } from '../reducers/post';
import CommentForm from './CommentForm';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import useInput from '../hooks/useInput';

moment.locale('ko');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const removePostLoading = useSelector((state) => state.post.removePostLoading);
  const reportPostLoading = useSelector((state) => state.post.reportPostLoading);
  const reportPostDone = useSelector((state) => state.post.reportPostDone);
  const reportPostError = useSelector((state) => state.post.reportPostError);
  const id = useSelector((state) => state.user.me?.id); // state.user.me && state.user.me.id
  const liked = post.Likers.find((v) => v.id === id);

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportText, onChangeReportText] = useInput('');
  const [editMode, setEditmode] = useState(false);

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onUnLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onClickUpdate = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    setEditmode(true);
  }, []);

  const onChangePost = useCallback((editText) => () => {
    dispatch({
      type: UPDATE_POST_REQUEST,
      data: {
        PostId: post.id,
        content: editText,
      },
    });
  }, [post]);

  const onCancelUpdatePost = useCallback(() => {
    setEditmode(false);
  }, []);

  const onClickReport = useCallback(() => {
    console.log('신고', post.id);
    setModalVisible(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const onSubmitReport = useCallback(() => {
    console.log('submit', id, post.id, reportText);
    dispatch({
      type: REPORT_POST_REQUEST,
      data: {
        postId: post.id,
        content: reportText,
      },
    });
  }, [reportText]);

  useEffect(() => {
    if (reportPostDone) {
      setModalVisible(false);
    }
    if (reportPostError) {
      setModalVisible(false);
    }
  }, [reportPostDone, reportPostError]);

  return (
    <div style={{ marginBottom: '10px' }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnLike} />
            : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="ellipsis"
            content={(
              <Button.Group>
                { id && post.User.id === id
                  ? (
                    <>
                      {!post.RetweetId && <Button onClick={onClickUpdate}>수정</Button>}
                      <Button onClick={onRemovePost} loading={removePostLoading}>삭제</Button>
                    </>
                  )
                  : <Button danger onClick={onClickReport}>신고</Button>}
              </Button.Group>
            )}
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={<FollowButton post={post} />}
      >
        <Modal
          title="신고하기"
          visible={modalVisible}
          onOk={onSubmitReport}
          confirmLoading={reportPostLoading}
          onCancel={onCloseModal}
        >
          <form>
            <Input.TextArea value={reportText} onChange={onChangeReportText} />
          </form>
        </Modal>
        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
              <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta
                avatar={(
                  <Link href={`/user/${post.Retweet.User.id}`}>
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                )}
                title={post.Retweet.User.nickname[0]}
                description={<PostCardContent postData={post.Retweet.content} onChangePost={onChangePost} onCancelUpdatePost={onCancelUpdatePost} />}
              />
            </Card>
          )
          : (
            <>
              <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta
                avatar={(
                  <Link href={`/user/${post.User.id}`}>
                    <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                  </Link>
                )}
                title={post.User.nickname[0]}
                description={<PostCardContent editMode={editMode} postData={post.content} onChangePost={onChangePost} onCancelUpdatePost={onCancelUpdatePost} />}
              />
            </>
          )}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length} 개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    User: PropTypes.object.isRequired,
    createdAt: PropTypes.string,
    Images: PropTypes.arrayOf(PropTypes.any),
    content: PropTypes.string.isRequired,
    Comments: PropTypes.string.isRequired,
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
