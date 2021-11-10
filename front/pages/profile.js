import React from 'react';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const profile = () => {
  const followingsList = [{ nickname: 'zerocho' }, { nickname: 'zerotwo' }, { nickname: 'hackjin' }];
  const followersList = [{ nickname: 'zeroch1o' }, { nickname: 'zerotwo1' }, { nickname: 'hackjin2' }];

  return (
    <AppLayout>
      <NicknameEditForm />
      <FollowList header="팔로잉" data={followingsList} />
      <FollowList header="팔로워" data={followersList} />
    </AppLayout>
  );
};

export default profile;
