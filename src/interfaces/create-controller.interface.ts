import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

/* Defining the interface for the function. */
export interface CreateControllerInterface {
  controller: (req: Request, res: Response, next: NextFunction) => any;
  middlewares?: RequestHandler[];
  schema?: AnyZodObject;
}
