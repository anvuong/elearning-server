/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('videos_categories', {
    video_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'videos',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'videos_categories'
  });
};
