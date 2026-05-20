import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import AppError from "../errors/AppError.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

export const generateAccessToken = (userId) => {
  if (!userId || typeof userId !== "string") {
    throw new AppError("ID de usuário inválido.", 500);
  }
  try {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      algorithm: "HS256",
    });
  } catch (err) {
    throw new AppError("Erro ao gerar access token.", 500);
  }
};

export const generateRefreshToken = async (userId, models) => {
  if (!userId || typeof userId !== "string") {
    throw new AppError("ID de usuário inválido.", 500);
  }
  if (!models || !models.RefreshToken) {
    throw new AppError("Modelos de banco de dados indisponíveis.", 500);
  }
  try {
    await models.RefreshToken.destroy({
      where: {
        userId,
        expiresAt: { [Op.lt]: new Date() },
      },
    });

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await models.RefreshToken.create({ token, userId, expiresAt });
    return token;
  } catch (err) {
    console.error("[REFRESH TOKEN ERROR]", err.message, err.stack);
    throw new AppError(`Erro ao gerar refresh token: ${err.message}`, 500);
  }
};

export const verifyAccessToken = (token) => {
  if (!token || typeof token !== "string") {
    throw new AppError("Token inválido.", 401);
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (!decoded.userId) {
      throw new AppError("Token corrompido: userId não encontrado.", 401);
    }
    return decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Access token expirado.", 401);
    }
    if (err.name === "JsonWebTokenError") {
      throw new AppError("Token inválido.", 401);
    }
    throw err;
  }
};