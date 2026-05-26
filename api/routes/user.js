import { Router } from "express";
import UserController from "../controllers/userController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/me", UserController.getMe);
router.put("/me", UserController.updateMe);
router.put("/me/password", UserController.updatePassword);
router.delete("/me", UserController.deleteMe);

export default router;
