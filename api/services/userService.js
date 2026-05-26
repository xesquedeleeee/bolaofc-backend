import AppError from "../errors/AppError.js";

export const getMe = async (userId, models) => {
  const user = await models.User.findByPk(userId);
  if (!user) throw new AppError("Usuário não encontrado.", 404);
  return user;
};

export const updateMe = async (userId, { name }, models) => {
  if (!name || name.trim().length < 3 || name.trim().length > 100) {
    throw new AppError("Nome deve ter entre 3 e 100 caracteres.", 400);
  }
  const user = await models.User.findByPk(userId);
  if (!user) throw new AppError("Usuário não encontrado.", 404);
  user.name = name.trim();
  await user.save();
  return user;
};

export const updatePassword = async (
  userId,
  { currentPassword, newPassword },
  models,
) => {
  if (!currentPassword || !newPassword) {
    throw new AppError("Senha atual e nova senha são obrigatórias.", 400);
  }
  if (newPassword.length < 6) {
    throw new AppError("Nova senha deve ter no mínimo 6 caracteres.", 400);
  }
  const user = await models.User.findByPk(userId);
  if (!user) throw new AppError("Usuário não encontrado.", 404);
  const isValid = await user.validatePassword(currentPassword);
  if (!isValid) throw new AppError("Senha atual incorreta.", 401);
  user.password = newPassword;
  await user.save();
};

export const deleteMe = async (userId, models) => {
  const user = await models.User.findByPk(userId);
  if (!user) throw new AppError("Usuário não encontrado.", 404);
  await user.destroy();
};
