import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card } from 'antd';

import { LOGOUT_REQUEST } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const onLogout = useCallback(() => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {me.Posts.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key="followers">
          팔로워
          <br />
          {me.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta
        avatar={me.nickname[0]}
        title={me.nickname}
      />
      <Button onClick={onLogout}>로그 아웃</Button>
    </Card>
  );
};

export default UserProfile;
