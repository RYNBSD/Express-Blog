import { z } from "zod";

export const access = {
    Email: z.object({ email: z.string().trim().email() }).strict()
} as const