module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', { // MY SQL에서는 posts 테이블로 생성됨
    // id가 기본적으로 들어있음
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', //한글 저장, mb4 -> 이모티콘저장
  });
  Post.associate = (db) => {};
  return Post;
};
