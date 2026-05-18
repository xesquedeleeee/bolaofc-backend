import * as AuthService from "../services/authService.js";
import AppError from "../errors/AppError.js";

const register = async (req, res, next) => {
  try {
    // Validar que body existe e contém os campos requeridos
    if (!req.body) {
      throw new AppError("Corpo da requisição obrigatório.", 400);
    }
    
    const { name, email, password } = req.body;
    
    const { user, accessToken, refreshToken } = await AuthService.register(
      { name, email, password },
      req.context.models
    );
    
    return res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    // Validar que body existe e contém os campos requeridos
    if (!req.body) {
      throw new AppError("Corpo da requisição obrigatório.", 400);
    }
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new AppError("E-mail e senha são obrigatórios.", 400);
    }
    
    const { user, accessToken, refreshToken } = await AuthService.login(
      { email, password },
      req.context.models
    );
    
    return res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new AppError("Corpo da requisição obrigatório.", 400);
    }
    
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new AppError("Refresh token obrigatório.", 400);
    }
    
    const { accessToken } = await AuthService.refresh(
      refreshToken,
      req.context.models
    );
    
    return res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new AppError("Corpo da requisição obrigatório.", 400);
    }
    
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new AppError("Refresh token obrigatório para logout.", 400);
    }
    
    await AuthService.logout(refreshToken, req.context.models);
    
    return res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso.",
    });
  } catch (err) {
    next(err);
  }
};

export default { register, login, refresh, logout };