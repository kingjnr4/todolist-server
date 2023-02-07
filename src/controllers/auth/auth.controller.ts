import { AuthService } from '../../services/auth/auth.service';
import { NextFunction, Response, Request } from "express";
import { number } from 'zod';
import httpStatus from 'http-status';

export class AuthController {


  async register(req: Request, res: Response, next: NextFunction) {
  try {
    const service = new AuthService()
    const details = await service.register(req)
    return res.send(details)
  } catch (e) {
    next(e)
  }
  }

  async login(req: Request, res: Response, next: NextFunction) {
   try {
    const service = new AuthService()
    const details = await service.login(req)
    return res.send(details)
   } catch (e) {
    next(e)
   }
  }

  async profile(req: Request, res: Response, next: NextFunction) {
   try {
    const {password,...details} = req.authUser
    return res.send(details)
   } catch (e) {
    next(e)
   }
  }
  
  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const service = new AuthService()
      const details = await service.verify(req)
      if(details==null) res.status(httpStatus.EXPECTATION_FAILED).send({success:false})
      return res.send(details)
    } catch (e) {
      next(e)
    }
  }
}
