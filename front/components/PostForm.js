import React, { useCallback, useRef } from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';

import useInput from '../hooks/useInput';
import { ADD_POST_REQUEST } from '../reducers/post';

const PostForm = () => {
  const dispatch = useDispatch();
  const imageInput = useRef();

  const onImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const [text, onChangeText] = useInput('');

  const onSubmit = useCallback(() => {
    dispatch({
      type: ADD_POST_REQUEST,
      data: text,
    });
  }, [text]);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        bordered
        value={text}
        onChange={onChangeText}
        maxLength={280}
        placeholder="어떤 일이 일어나고 있나요?"
      />
      <div>
        <input type="file" multiple hidden ref={imageInput} />
        <Button onClick={onImageUpload}>이미지 업로드</Button>
        <Button style={{ float: 'right' }} type="primary" htmlType="submit">삐약</Button>
      </div>
    </Form>
  );
};

export default PostForm;
