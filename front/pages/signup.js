import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import Router from 'next/router';
import { END } from 'redux-saga';

import useInput from '../hooks/useInput';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  const [term, setTerm] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [termError, setTermError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password);
  }, []);

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  const onSubmitForm = useCallback(() => {
    if (password !== passwordCheck) {
      setPasswordError(true);
      return;
    }
    if (!term) {
      setTermError(true);
      return;
    }
    console.log(email, password, nickname);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        email, password, nickname,
      },
    });
  }, [email, password, nickname, term, passwordCheck]);

  return (
    <>
      <Form onFinish={onSubmitForm}>
        <div>
          <label htmlFor="email">이메일</label>
          <br />
          <Input
            name="email"
            value={email}
            onChange={onChangeEmail}
            required
          />
        </div>
        <div>
          <label htmlFor="nickname">닉네임</label>
          <br />
          <Input
            name="nickname"
            value={nickname}
            onChange={onChangeNickname}
            required
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <Input
            name="password"
            value={password}
            onChange={onChangePassword}
            required
          />
        </div>
        <div>
          <label htmlFor="passwordCheck">비밀번호 확인</label>
          <br />
          <Input
            name="passwordCheck"
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            required
          />
          {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        <div>
          <Checkbox name="term" checked={term} onChange={onChangeTerm}>위 약관에 동의합니다.</Checkbox>
          {termError && <div style={{ color: 'red' }}>약관에 동의해야 가입이 완료됩니다.</div>}
        </div>
        <div>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>회원가입하기</Button>
        </div>
      </Form>
    </>
  );
};

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
  store.dispatch(END);
  console.log('getServerSideProps end');
  await store.sagaTask.toPromise();
});

export default signup;
