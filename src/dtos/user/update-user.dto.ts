import { z } from 'zod';
import { createUserSchema } from './create-user.dto';
export const updateUserSchema = createUserSchema.deepPartial().extend({
    params:z.object({
        id:z.string().min(1)
    }),
    body:z.object({
        email:z.never(),
        password:z.never()
    })
})
const partialCreate = createUserSchema.deepPartial().extend({
    params:z.object({
        id:z.string().min(1)
    }),
})
export type updateUserDto = z.infer<typeof partialCreate> 