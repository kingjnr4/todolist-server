import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { parseEnv, port } from "znv";
import { z } from "zod";
let init = config();
expand(init);
const envSchema = {
  NODE_ENV: z.string().min(1),
  PORT: port().nullable(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1),
  LOG_FORMAT: z.string().nullable(),
  LOG_DIR: z.string().min(1),
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  CORS_CREDENTIALS: z.boolean().default(true),
  SECRET_KEY: z.string().default("mysecret"),
  EMAIL_HOST: z.string().min(1),
  EMAIL_PORT: port().default(2525),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string().min(1),
  EMAIL_SECURE: z.boolean(),
};

export const {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  LOG_FORMAT,
  LOG_DIR,
  CORS_ORIGIN,
  DATABASE_URL,
  CORS_CREDENTIALS,
  SECRET_KEY,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_SECURE,
} = Object.assign({}, parseEnv(process.env, envSchema));
