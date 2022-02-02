const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Posts extends Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      modelName: 'Post',
      tableName: 'posts',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', //한글 저장, mb4 -> 이모티콘저장
      sequelize,
    });
  }
  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    db.Post.belongsTo(db.Post, { as: 'Retweet' });
    db.Post.hasMany(db.Report);
  }
};

// 구문법
// module.exports = (sequelize, DataTypes) => {
//   const Post = sequelize.define('Post', { // MY SQL에서는 posts 테이블로 생성됨
//     // id가 기본적으로 들어있음
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//   }, {
//     charset: 'utf8mb4',
//     collate: 'utf8mb4_general_ci', //한글 저장, mb4 -> 이모티콘저장
//   });
//   Post.associate = (db) => {
//     db.Post.belongsTo(db.User);
//     db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
//     db.Post.hasMany(db.Comment);
//     db.Post.hasMany(db.Image);
//     db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
//     db.Post.belongsTo(db.Post, { as: 'Retweet' });
//   };
//   return Post;
// };
