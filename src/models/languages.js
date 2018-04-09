/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('languages', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'languages'
  });
};
