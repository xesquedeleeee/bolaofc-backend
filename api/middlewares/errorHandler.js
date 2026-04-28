import { ValidationError, UniqueConstraintError } from "sequelize";

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      status: 409,
      message: "Já existe um registro com esses dados.",
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 400,
      message: err.errors.map((e) => e.message).join(", "),
    });
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({ status, message });
};

export default errorHandler;