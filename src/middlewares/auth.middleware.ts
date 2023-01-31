import { RequestHandler } from 'express';
import { verifyJwt } from '../utils/helper';
import { UserService } from '../services/users/users.service';
export const authMiddleware:RequestHandler =async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1]
    const userService = new UserService()
  
    if (!token) {
      return res.status(401).send("Access Denied. No Token Provided.");
    }
    const payload =  verifyJwt(token)
    if (!payload) {
      return res.status(400).send("Invalid Token.");

    }
    const user = await userService.findOne(payload.id)
    req.authUser = user
    next();
  }