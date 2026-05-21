const getLeagueMemberModel = (sequelize, { DataTypes }) => {
  const LeagueMember = sequelize.define("leagueMember", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("owner", "member"),
      defaultValue: "member",
      allowNull: false,
    },
  });

  LeagueMember.associate = (models) => {
    LeagueMember.belongsTo(models.User, { onDelete: "CASCADE" });
    LeagueMember.belongsTo(models.Championship, { onDelete: "CASCADE" });
  };

  return LeagueMember;
};

export default getLeagueMemberModel;