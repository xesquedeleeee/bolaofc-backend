import { Router } from "express";
import ChampionshipController from "../controllers/championshipController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, ChampionshipController.getAll);
router.get("/:id", authenticate, ChampionshipController.getById);
router.post("/", authenticate, ChampionshipController.create);
router.put("/:id", authenticate, ChampionshipController.update);
router.delete("/:id", authenticate, ChampionshipController.remove);

// ─── ROTA COMPOSTA ────────────────────────────────────────────────────────────
router.get("/:id/matches", authenticate, ChampionshipController.getMatches);

export default router;