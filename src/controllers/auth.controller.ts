import { AuthService } from './../services/auth/auth.service';
import { NextFunction, Response, Request } from "express";

export class AuthController {
  private  authService:AuthService
  constructor(){
    this.authService=new AuthService()
  }
  async register(req: Request, res: Response, next: NextFunction) {
    const register = await this.authService.register(req)
    return res.send(register)
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const details = await this.authService.login(req)
    return res.send(details)
  }

  async profile(req: Request, res: Response, next: NextFunction) {
  return req.authUser
  }
}
