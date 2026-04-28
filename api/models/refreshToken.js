import { v4 as uuidv4 } from "uuid";

const getRefreshTokenModel = (sequelize, { DataTypes }) => {
  const RefreshToken = sequelize.define("refreshToken", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  RefreshToken.prototype.isExpired = function () {
    return new Date() > this.expiresAt;
  };

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { onDelete: "CASCADE" });
  };

  return RefreshToken;
};

export default getRefreshTokenModel;