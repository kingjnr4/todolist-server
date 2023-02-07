import { OtpType } from "@prisma/client";
import { z } from "zod";

export const verifyOtpSchema = z.object({
    body:z.object({
        token:z.string().min(6).max(6),
        type:z.nativeEnum(OtpType),
        password:z.string().min(8).nullable()
    })
})

export type verifyOtpDto = z.infer<typeof verifyOtpSchema>