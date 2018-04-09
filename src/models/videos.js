/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('videos', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    level: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subtitle_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    youtube_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    youtube_viewcount: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    view_count: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    uploaded_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_featured: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    true_subs: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true,
      defaultValue: '1'
    }
  }, {
    timestamps: false,
    tableName: 'videos'
  });
};
