import Sequelize from "sequelize";
import pg from "pg";

import getUserModel from "./user.js";
import getRefreshTokenModel from "./refreshToken.js";
import getChampionshipModel from "./championship.js";
import getMatchModel from "./match.js";
import getBetModel from "./bet.js";
import getLeagueMemberModel from "./leagueMember.js";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  dialectModule: pg,
});

const models = {
  User: getUserModel(sequelize, Sequelize),
  RefreshToken: getRefreshTokenModel(sequelize, Sequelize),
  Championship: getChampionshipModel(sequelize, Sequelize),
  Match: getMatchModel(sequelize, Sequelize),
  Bet: getBetModel(sequelize, Sequelize),
  LeagueMember: getLeagueMemberModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;