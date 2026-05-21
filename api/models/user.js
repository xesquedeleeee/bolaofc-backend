import bcrypt from "bcryptjs";

const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define("user", {
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
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { notEmpty: true, isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [6, 100] },
    },
  });

  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 12);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 12);
    }
  });

  User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.findByLogin = async (login) => {
    let user = await User.findOne({ where: { email: login } });
    return user;
  };

  User.associate = (models) => {
  User.hasMany(models.RefreshToken, { onDelete: "CASCADE" });
  User.hasMany(models.Championship, { onDelete: "CASCADE" });
  User.hasMany(models.Bet, { onDelete: "CASCADE" });
  User.hasMany(models.LeagueMember, { onDelete: "CASCADE" });
};

  return User;
};

export default getUserModel;