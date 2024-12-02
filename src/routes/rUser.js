import cUser from "../controllers/cUser.js";

import { Router } from "express";

const router = Router();

router.get("/login", cUser.getLoginForm);

router.post("/login", cUser.login);

export default router;
