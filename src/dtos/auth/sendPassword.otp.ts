import { z } from "zod";

export const sendPasswordResetSchema = z.object({
    body:z.object({
        email:z.string()
    })
})

export type sendPasswordResetDto = z.infer<typeof sendPasswordResetSchema>