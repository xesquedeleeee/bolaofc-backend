const getBetModel = (sequelize, { DataTypes }) => { 

  const Bet = sequelize.define("bet", { 

    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true, 
    }, 
    predictedHome: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
    }, 
    predictedAway: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
    }, 
    points: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0, 
    }, 
  }); 

  Bet.associate = (models) => { 
    Bet.belongsTo(models.User, { onDelete: "CASCADE" }); 
    Bet.belongsTo(models.Match, { onDelete: "CASCADE" }); 

  }; 
  return Bet; 
}; 
export default getBetModel; 