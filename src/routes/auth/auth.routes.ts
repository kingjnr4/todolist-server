import { createUserSchema } from './../../dtos/user/create-user.dto';
import { loginSchema } from './../../dtos/auth/login.dto';
import { createController } from "./../../utils/createController";
import { Router } from "express";
import { AppRoutes } from "./../../interfaces/route.interface";
import { AuthController } from "../../controllers/auth/auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import validationMiddleware from '../../middlewares/validation.middleware';
export class AuthRoute implements AppRoutes {
  path: string = "auth";
  router: Router = Router();
  private authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      "/register",
      validationMiddleware(createUserSchema),
      this.authController.register
    );
    this.router.post('/login',
      validationMiddleware(loginSchema),
      this.authController.login
    )
    this.router.get('/profile', authMiddleware, this.authController.profile)
  }
}
