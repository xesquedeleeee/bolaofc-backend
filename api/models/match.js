const getMatchModel = (sequelize, { DataTypes }) => { 

  const Match = sequelize.define("match", { 

    id: { 

      type: DataTypes.UUID, 

      defaultValue: DataTypes.UUIDV4, 

      primaryKey: true, 

    }, 

    homeTeam: { 

      type: DataTypes.STRING, 

      allowNull: false, 

      validate: { notEmpty: true }, 

    }, 

    awayTeam: { 

      type: DataTypes.STRING, 

      allowNull: false, 

      validate: { notEmpty: true }, 

    }, 

    matchDate: { 

      type: DataTypes.DATE, 

      allowNull: false, 

    }, 

    homeScore: { 

      type: DataTypes.INTEGER, 

      allowNull: true, 

    }, 

    awayScore: { 

      type: DataTypes.INTEGER, 

      allowNull: true, 

    }, 

  }); 

  

  Match.associate = (models) => { 

    Match.belongsTo(models.Championship, { onDelete: "CASCADE" }); 

    Match.hasMany(models.Bet, { onDelete: "CASCADE" }); 

  }; 

  

  return Match; 

}; 

  

export default getMatchModel; 