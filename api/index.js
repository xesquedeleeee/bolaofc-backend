import "dotenv/config";
import cors from "cors";
import express from "express";

import models, { sequelize } from "./models/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Injeta models no contexto de cada requisição ─────────────────────────────
app.use((req, res, next) => {
  req.context = { models };
  next();
});

// ─── Log de requisições ───────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use("/auth", routes.auth);
app.use("/championships", routes.championship);
app.use("/matches", routes.match);
app.use("/bets", routes.bet);
app.use("/users", routes.user);

// ─── Rota raiz ────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "BolãoFC API 🏆 - Servidor rodando!" });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Inicialização ────────────────────────────────────────────────────────────
const port = process.env.PORT ?? 3000;

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () =>
    console.log(`BolãoFC API rodando na porta ${port}! 🏆`),
  );
});

export default app;
