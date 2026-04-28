import AppError from "../errors/AppError.js";
import { generateAccessToken, generateRefreshToken } from "./tokenService.js";

export const register = async ({ name, email, password }, models) => {
  const existing = await models.User.findOne({ where: { email } });
  if (existing) throw new AppError("E-mail já cadastrado.", 409);

  const user = await models.User.create({ name, email, password });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id, models);

  return { user, accessToken, refreshToken };
};

export const login = async ({ email, password }, models) => {
  const user = await models.User.findByLogin(email);
  if (!user) throw new AppError("Credenciais inválidas.", 401);

  const isValid = await user.validatePassword(password);
  if (!isValid) throw new AppError("Credenciais inválidas.", 401);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id, models);

  return { user, accessToken, refreshToken };
};

export const refresh = async (token, models) => {
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
  await models.RefreshToken.destroy({ where: { token } });
};