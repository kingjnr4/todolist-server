import { RequestHandler } from "express";

import {  AnyZodObject } from "zod";
import HttpException from "../utils/exception";
import { logger } from "../utils/logger";

const validationMiddleware = (schema: AnyZodObject): RequestHandler => {
  return async (req, res, next) => {    
    const parseResult = await schema.spa({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!parseResult.success) {
      logger.error(parseResult.error.flatten());
      next(new HttpException(400, parseResult.error.issues as any));
      return;
    }
    next();
  };
};

export default validationMiddleware;
