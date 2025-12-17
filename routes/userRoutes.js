import { Router } from "express";

import * as userController from "../controllers/userController.js";

const userRouter = new Router();

userRouter.get("/sign-up", userController.getSignupForm);
userRouter.post("/sign-up", userController.postSignupForm);

userRouter.post("/log-in", userController.loginUser);
userRouter.post("/log-out", userController.logoutUser);

export { userRouter };
