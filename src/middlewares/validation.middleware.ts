import { RequestHandler } from "express";

import {  AnyZodObject } from "zod";
import HttpException from "../utils/exception";
import { logger } from "../utils/logger";

const validtaionMiddleware = (schema: AnyZodObject): RequestHandler => {
  return async (req, res, next) => {
    const parseResult = await schema.spa({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!parseResult.success) {
      logger.error(parseResult.error);
      next(new HttpException(400, parseResult.error.message));
      return;
    }

    next();
    return;
  };
};

export default validtaionMiddleware;
