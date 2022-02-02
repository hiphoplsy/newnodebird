const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Report extends Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      modelName: 'Report',
      tableName: 'reports',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', //한글 저장, mb4 -> 이모티콘저장
      sequelize,
    });
  }
  static associate(db) {
    db.Report.belongsTo(db.User);
    db.Report.belongsTo(db.Post);
  }
};