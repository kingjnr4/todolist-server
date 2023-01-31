import z, { TypeOf } from "zod";
import db from "../../db";

export const loginSchema = z.object({
 body:z.object({
    email:z.string().email().min(1).trim(),
    password:z.string().min(6),
 })
})

export type loginDto = z.infer<typeof loginSchema>