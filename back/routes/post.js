const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const { Post, Image, Comment, User, Hashtag, Report } = require('../models');
const { isLoggedIn } = require('./middlewares');

const prod = porcess.env.NODE_ENV === 'production';
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
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      }))); // [[노드, true], [리액트, true]] => 배열로 나오게 되므로 아래 map 반복문을 통해 첫번째 항목만 가져올 수 있게 함
    await post.addHashtags(result.map((v) => v[0]));
    }
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

router.post('/:postId/report', isLoggedIn, async (req, res, next) => {
  try {
    const post = await post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const exReport = await Post.findOne({
      where: {
        postId: parseInt(req.params.postId, 10),
        userId: req.user.id,
      },
    });
    if (exReport) {
      return res.status(403).send('이미 신고한 게시글입니다.');
    }
    await Report.create({
      content: req.body.content,
      postId: parseInt(req.params.postId, 10),
      userId: req.user.id,
    });
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      service: 'gmail',
      secure: true,
      auth: {
        user: 'hiphoplsy@gmail.com',
        pass: process.env.GMAIL_PASSWORD,
      },
    });
      await transporter.verify();
      await transporter.sendMail({
        from: '"NodeBird 신고내역" <report@nodebird.com>',
        to: '"NodeBird 관리자" <hiphoplsy@gmail.com>',
        subject: 'NodeBird - 신고 발생',
        html: `
          <div>
            <a href="${prod ? 'https://nodebird.com' : 'http://localhost:3060'}/post/${req.params.postId}"></a>
            <p>${req.body.content}</p>
          </div>
          `,
      });
      console.log('Mail sent');
      res.status(201).send('ok');
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

router.patch('/:postId', isLoggedIn, async(req, res, next) => { // UPDATE /post/1/
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    await Post.update({
      content: req.body.content,
    },{
      where: {
        id: req.params.postId,
        userId: req.user.id,
      }
    });
    const post = await Post.findOne({
      where: { id: req.params.postId }});
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      }))); // [[노드, true], [리액트, true]] => 배열로 나오게 되므로 아래 map 반복문을 통해 첫번째 항목만 가져올 수 있게 함
      await post.setHashtags(result.map((v) => v[0]));
    }
    res.status(200).json({ PostId: parseInt(req.params.postId, 10), content: req.body.content });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

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

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => { // POST /post/1/retweet
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [{
        model: Post,
        as: 'Retweet',
      }],
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗 했습니다.');
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    const retweetWithPrevPost = Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }],
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: User,
          as: 'Likers',
          attributes: ['id'],
        }]
      }],
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:postId', async (req, res, next) => { // GET /post/1/
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send('존재하지 않는 게시글입니다.');
    }
    const fullPost = Post.findOne({
      where: { id: post.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }],
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: User,
          as: 'Likers',
          attributes: ['id', 'nickname'],
        }],
      }],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
