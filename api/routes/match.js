// ─── ALEXIS ───────────────────────────────────────────────────────────────────
// Responsável: Alexis

import { Router } from "express";
import MatchController from "../controllers/matchController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, MatchController.getAll);
router.get("/:id", authenticate, MatchController.getById);
router.post("/", authenticate, MatchController.create);
router.put("/:id", authenticate, MatchController.update);
router.delete("/:id", authenticate, MatchController.remove);

// ─── ROTA COMPOSTA ────────────────────────────────────────────────────────────
router.get("/:id/bets", authenticate, MatchController.getBets);

export default router;