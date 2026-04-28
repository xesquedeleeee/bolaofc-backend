import * as AuthService from "../services/authService.js";

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.register(
      { name, email, password },
      req.context.models
    );
    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(
      { email, password },
      req.context.models
    );
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token obrigatório." });
    const { accessToken } = await AuthService.refresh(
      refreshToken,
      req.context.models
    );
    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken, req.context.models);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default { register, login, refresh, logout };