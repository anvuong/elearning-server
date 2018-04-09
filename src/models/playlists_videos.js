/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('playlists_videos', {
    playlist_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'playlists',
        key: 'id'
      }
    },
    video_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'videos',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'playlists_videos'
  });
};
