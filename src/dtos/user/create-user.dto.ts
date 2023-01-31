import z, { TypeOf } from "zod";
import db from "../../db";

export const createUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email is required",
      })
      .email("must be email")
      .min(1)
      .trim()
      .refine(async (email) => {
        const user = await db.getClient().user.findFirst({
          where: {
            email,
          },
        });
        return !Boolean(user);
      }, "User already exists"),
    password: z.string({ required_error: "password is required" }).min(6),
    username: z
      .string({ required_error: "password is required" })
      .min(4)
      .optional(),
  }),
});

export type createUserDto = z.infer<typeof createUserSchema>;
