import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';

const PostCardContent = ({ postData, editMode, onChangePost, onCancelUpdatePost }) => {
  const { updatePostLoading, updatePostDone } = useSelector((state) => state.post);
  const [editText, setEditText] = useState(postData);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdatePost();
    }
  }, [updatePostDone]);

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  }, []);

  return (
    <div>
      {editMode
        ? (
          <>
            <Input.TextArea value={editText} onChange={onChangeText} />
            <Button.Group>
              <Button loading={updatePostLoading} onClick={onChangePost(editText)}>수정</Button>
              <Button type="danger" onClick={onCancelUpdatePost}>수정 취소</Button>
            </Button.Group>
          </>
        )
        : postData.split(/#([^\s#]+)/g).map((v) => {
          if (v.match(/#([^\s#]+)/)) {
            return <Link href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }} as={`/hashtag/${v.slice(1)}`}><a>{v}</a></Link>;
          }
          return v;
        })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onChangePost: PropTypes.func.isRequired,
  onCancelUpdatePost: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;
