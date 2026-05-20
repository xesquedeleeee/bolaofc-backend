import AppError from "../errors/AppError.js";
import { generateAccessToken, generateRefreshToken } from "./tokenService.js";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const validatePassword = (password) => {
  return password && password.length >= 6;
};
const validateName = (name) => {
  return name && name.trim().length >= 3 && name.trim().length <= 100;
};

export const register = async ({ name, email, password }, models) => {
  if (!name || !validateName(name)) {
    throw new AppError("Nome deve ter entre 3 e 100 caracteres.", 400);
  }
  if (!email || !validateEmail(email)) {
    throw new AppError("E-mail inválido.", 400);
  }
  if (!password || !validatePassword(password)) {
    throw new AppError("Senha deve ter no mínimo 6 caracteres.", 400);
  }
  const existing = await models.User.findOne({ where: { email } });
  if (existing) throw new AppError("E-mail já cadastrado.", 409);
  const user = await models.User.create({ name, email, password });
  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id, models);
  return { user, accessToken, refreshToken };
};

export const login = async ({ email, password }, models) => {
  if (!email || !validateEmail(email)) {
    throw new AppError("E-mail inválido.", 400);
  }
  if (!password || typeof password !== "string") {
    throw new AppError("Senha obrigatória.", 400);
  }
  const user = await models.User.findByLogin(email);
  if (!user) throw new AppError("Credenciais inválidas.", 401);
  const isValid = await user.validatePassword(password);
  if (!isValid) throw new AppError("Credenciais inválidas.", 401);
  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id, models);
  return { user, accessToken, refreshToken };
};

export const refresh = async (token, models) => {
  if (!token || typeof token !== "string") {
    throw new AppError("Refresh token obrigatório.", 400);
  }
  const record = await models.RefreshToken.findOne({ where: { token } });
  if (!record) throw new AppError("Refresh token inválido.", 401);
  if (record.isExpired()) {
    await record.destroy();
    throw new AppError("Refresh token expirado. Faça login novamente.", 401);
  }
  const accessToken = generateAccessToken(record.userId);
  return { accessToken };
};

export const logout = async (token, models) => {
  if (!token || typeof token !== "string") {
    throw new AppError("Refresh token obrigatório para logout.", 400);
  }
  const result = await models.RefreshToken.destroy({ where: { token } });
  if (result === 0) {
    throw new AppError("Refresh token não encontrado.", 404);
  }
};
EOF