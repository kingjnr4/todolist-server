import validationMiddleware from "../middlewares/validation.middleware";
import { CreateControllerInterface } from "./../interfaces/create-controller.interface";
import { RequestHandler } from "express";

export const createController = ({
  schema,
  controller,
  middlewares,
}: CreateControllerInterface): RequestHandler => {
  const all = [];
  if (schema) {
    all.push(validationMiddleware(schema));
  }
  if (middlewares) {
    all.push(...middlewares);
  }
  all.push(controller);
  return composeMiddlewares(all);
};

const composeMiddlewares =
  (middlewares: any[]) => async (req: any, res: any, next: any) => {
    for (const middleware of middlewares) {
      try {
        await middleware(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  };
