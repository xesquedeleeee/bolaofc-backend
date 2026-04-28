const getChampionshipModel = (sequelize, { DataTypes }) => {
  const Championship = sequelize.define("championship", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    season: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Championship.associate = (models) => {
    Championship.belongsTo(models.User, { onDelete: "CASCADE" });
    Championship.hasMany(models.Match, { onDelete: "CASCADE" });
  };

  return Championship;
};

export default getChampionshipModel;