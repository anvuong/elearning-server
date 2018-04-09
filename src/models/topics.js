/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('topics', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    topic: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    created_user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'topics'
  });
};
