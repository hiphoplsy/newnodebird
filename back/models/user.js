module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // MY SQL에서는 users 테이블로 생성됨
    // id가 기본적으로 들어있음
    email: {
      type: DataTypes.STRING(30),
      allowNull: false, // 필수
      unique: true, // 고유한 값
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false, // 필수
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false, // 필수
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', //한글 저장
  });
  User.associate = (db) => {};
  return User;
};
