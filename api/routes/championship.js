import { Router } from "express";
import ChampionshipController from "../controllers/championshipController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, ChampionshipController.getAll);
router.get("/my-leagues", authenticate, ChampionshipController.getUserLeagues);
router.get("/:id", authenticate, ChampionshipController.getById);
router.post("/", authenticate, ChampionshipController.create);
router.put("/:id", authenticate, ChampionshipController.update);
router.delete("/:id", authenticate, ChampionshipController.remove);

// ─── ROTAS COMPOSTAS ──────────────────────────────────────────────────────────
router.get("/:id/matches", authenticate, ChampionshipController.getMatches);
router.get("/:id/members", authenticate, ChampionshipController.getMembers);
router.post("/:id/join", authenticate, ChampionshipController.join);
router.delete("/:id/leave", authenticate, ChampionshipController.leave);

export default router;