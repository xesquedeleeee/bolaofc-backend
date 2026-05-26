import * as UserService from "../services/userService.js";

const getMe = async (req, res, next) => {
  try {
    const user = await UserService.getMe(req.userId, req.context.models);
    return res.status(200).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new AppError("Corpo da requisição obrigatório.", 400);
    }
    const { name } = req.body;
    const user = await UserService.updateMe(
      req.userId,
      { name },
      req.context.models,
    );
    return res.status(200).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new AppError("Corpo da requisição obrigatório.", 400);
    }
    const { currentPassword, newPassword } = req.body;
    await UserService.updatePassword(
      req.userId,
      { currentPassword, newPassword },
      req.context.models,
    );
    return res.status(200).json({
      success: true,
      message: "Senha atualizada com sucesso.",
    });
  } catch (err) {
    next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    await UserService.deleteMe(req.userId, req.context.models);
    return res.status(200).json({
      success: true,
      message: "Conta deletada com sucesso.",
    });
  } catch (err) {
    next(err);
  }
};

export default { getMe, updateMe, updatePassword, deleteMe };
