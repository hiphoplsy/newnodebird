const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) {
    return super.init({
      // id가 기본적으로 들어있음
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
    }, {
      modelName: 'Comment',
      tableName: 'comments',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', //한글 저장 mb4 -> 이모티콘 저장
      sequelize,
    });
  }
  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
};
// 최신 문법


// 구문법
// module.exports = (sequelize, DataTypes) => {
//   const Comment = sequelize.define('Comment', { // MY SQL에서는 comments 테이블로 생성됨
//     // id가 기본적으로 들어있음
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//   }, {
//     charset: 'utf8mb4',
//     collate: 'utf8mb4_general_ci', //한글 저장 mb4 -> 이모티콘 저장
//   });
//   Comment.associate = (db) => {
//     db.Comment.belongsTo(db.User);
//     db.Comment.belongsTo(db.Post);
//   };
//   return Comment;
// };

