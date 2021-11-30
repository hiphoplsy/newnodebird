const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Image, Comment, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('upload');
} catch (error) {
  console.log('uploads 폴더가 없어 생성되었습니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자추출: 학진쓰.png => .png 추출
      const basename = path.basename(file.originalname); // 이름추출: 학진쓰.png => 학진쓰를 추출
      done(null, basename + '_' + new Date().getTime() + ext); // 파일이름 합치기: 학진쓰_123123.png 완성
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 용량제한 20MB
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // /POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (req.body.image) {
      if (Array.isArray(req.body.image)) { // 이미지를 여러개 올리면 [학진쓰1.png, 학진쓰2.png] 배열로 감싸짐
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await Post.addImages(images);
      } else { // 이미지를 한개만 올리면 학진쓰.png 로 배열로 감싸지지 않음.
        const image = await Image.create({ src: req.body.image });
        await Post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
    }, {
      include: [{
        model: Image,
      }, {
        model: Comment,
        include: [{
            model: User, // 댓글 작성자
            attributes: ['id', 'nickname'],
        }],
      }, {
        model: User, // 게시글 작성자
        attributes: ['id', 'nickname'],
      }, {
        model: User, // 게시글 좋아요 누른사람
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    return res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
  try {
    res.json(req.files.map((v) => v.filename));
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => { // /POST /post/1/comment
  try {
    const post = await Post.findOne({
      where: { id: req.params.PostId },
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.PostId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { // PATCH /post/1/like/
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId }
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => { // DELETE /post/1/like/
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId }
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => { // /DELETE /post/1/
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});



module.exports = router;
