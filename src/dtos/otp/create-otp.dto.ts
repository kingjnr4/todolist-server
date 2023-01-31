import { OtpType } from "@prisma/client";
import { z } from "zod";

const createOtpSchema = z.object({
    body:z.object({
        user_id:z.string().min(1),
        type:z.nativeEnum(OtpType)
    })
})

export type createOtpDto = z.infer<typeof createOtpSchema>