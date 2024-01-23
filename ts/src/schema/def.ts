import { z } from "zod";

export const definitions = {
    Params: {
        userId: z.object({ userId: z.string().trim().uuid() }).strict()
    }
} as const