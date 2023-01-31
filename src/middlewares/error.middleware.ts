
import { NextFunction, Request, Response } from "express";
import HttpException from "../utils/exception";
import { logger } from "../utils/logger";



/**
 * It takes in an error, a request, a response, and a next function, and then logs the error, and sends
 * a response with the error message
 * @param {HttpException} error - The error object that was thrown.
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - The response object
 * @param {NextFunction} next - This is a function that you call when you want to pass control to the
 * next middleware function.
 */
const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";

    logger.error(
      `[${req.method}] ${req.path}  >> StatusCode:: ${status}, Message:: ${message}`
    );
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;