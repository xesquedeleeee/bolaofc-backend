// ─── LEVI ─────────────────────────────────────────────────────────────────────
// Responsável: Levi

import { Router } from "express";
import BetController from "../controllers/betController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/ranking", authenticate, BetController.getRanking);
router.get("/", authenticate, BetController.getAll);
router.get("/:id", authenticate, BetController.getById);
router.post("/", authenticate, BetController.create);
router.put("/:id", authenticate, BetController.update);
router.delete("/:id", authenticate, BetController.remove);

export default router;