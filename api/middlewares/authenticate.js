import AppError from "../errors/AppError.js";
import { verifyAccessToken } from "../services/tokenService.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Validação rigorosa do header
    if (!authHeader) {
      throw new AppError("Token não fornecido. Use 'Authorization: Bearer {token}'.", 401);
    }

    if (typeof authHeader !== "string") {
      throw new AppError("Header de autorização inválido.", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError("Formato de autorização inválido. Use 'Authorization: Bearer {token}'.", 401);
    }

    const parts = authHeader.split(" ");
    
    if (parts.length !== 2) {
      throw new AppError("Formato de autorização inválido.", 401);
    }

    const token = parts[1];
    
    if (!token || token.trim() === "") {
      throw new AppError("Token não fornecido.", 401);
    }

    const decoded = verifyAccessToken(token);

    // Validação adicional do payload
    if (!decoded || !decoded.userId) {
      throw new AppError("Token inválido: dados do usuário não encontrados.", 401);
    }

    req.userId = decoded.userId;

    next();
  } catch (err) {
    // Se for erro de AppError, passa direto
    if (err instanceof AppError) {
      return next(err);
    }
    
    // Tratamento de erros JWT específicos
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Access token expirado. Renove seu token.", 401));
    }
    
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Token inválido ou corrompido.", 401));
    }
    
    if (err.name === "NotBeforeError") {
      return next(new AppError("Token ainda não é válido.", 401));
    }

    // Erro genérico
    next(new AppError("Erro ao autenticar requisição.", 401));
  }
};

export default authenticate;