import { config } from "dotenv";
import {expand } from 'dotenv-expand'
import {parseEnv,port}  from 'znv'
import { z } from "zod";
let init = config();
expand(init)
const envSchema = {
  NODE_ENV:z.string().min(1),
  PORT:port().nullable(),
  JWT_SECRET_KEY:z.string().min(1),
  JWT_EXPIRES_IN:z.string().min(1),
  LOG_FORMAT:z.string().nullable(),
  LOG_DIR:z.string().min(1),
  CORS_ORIGIN:z.string(),
  DATABASE_URL:z.string(),
  CORS_CREDENTIALS:z.boolean().default(true)
}

export const {
  NODE_ENV,
  PORT,
  JWT_SECRET_KEY,
  JWT_EXPIRES_IN,
  LOG_FORMAT,
  LOG_DIR,
  CORS_ORIGIN,
  DATABASE_URL,
  CORS_CREDENTIALS
} = parseEnv(process.env,envSchema);