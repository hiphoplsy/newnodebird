const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    }, {
      modelName: 'Hashtag',
      tableName: 'hashtags',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', //한글 저장 mb4 -> 이모티콘 저장
      sequelize,
    });
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  }
};

// 구문법
// module.exports = (sequelize, DataTypes) => {
//   const Hashtag = sequelize.define('Hashtag', { // MY SQL에서는 users 테이블로 생성됨
//     // id가 기본적으로 들어있음
//     name: {
//       type: DataTypes.STRING(20),
//       allowNull: false,
//     },
//   }, {
//     charset: 'utf8mb4',
//     collate: 'utf8mb4_general_ci', //한글 저장 mb4 -> 이모티콘 저장
//   });
//   Hashtag.associate = (db) => {
//     db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
//   };
//   return Hashtag;
// };
