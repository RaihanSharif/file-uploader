import { Router } from "express";

import { getSignupForm } from "../controllers/userController.js";

const authRouter = new Router();

authRouter.get("/sign-up", getSignupForm);

export { authRouter };
