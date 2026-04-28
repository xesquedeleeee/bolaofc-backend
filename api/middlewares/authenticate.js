import AppError from "../errors/AppError.js";
import { verifyAccessToken } from "../services/tokenService.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Token não fornecido.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Access token expirado.", 401));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Token inválido.", 401));
    }
    next(err);
  }
};

export default authenticate;