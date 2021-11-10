module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', { // MY SQL에서는 users 테이블로 생성됨
    // id가 기본적으로 들어있음
    src: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', //한글 저장 mb4 -> 이모티콘 저장
  });
  Image.associate = (db) => {};
  return Image;
};
