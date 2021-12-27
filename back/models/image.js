const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Image extends Model {
  static init(sequelize) {
    return super.init({
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    }, {
      modelName: 'Image',
      tableName: 'images',
      charset: 'utf8',
      collate: 'utf8_general_ci', //한글 저장 mb4 -> 이모티콘 저장
      sequelize,
    });
  }
  static associate(db) {
    db.Image.belongsTo(db.Post);
  }
};

// 구문법
// module.exports = (sequelize, DataTypes) => {
//   const Image = sequelize.define('Image', { // MY SQL에서는 users 테이블로 생성됨
//     // id가 기본적으로 들어있음
//     src: {
//       type: DataTypes.STRING(200),
//       allowNull: false,
//     },
//   }, {
//     charset: 'utf8',
//     collate: 'utf8_general_ci', //한글 저장 mb4 -> 이모티콘 저장
//   });
//   Image.associate = (db) => {
//     db.Image.belongsTo(db.Post);
//   };
//   return Image;
// };
