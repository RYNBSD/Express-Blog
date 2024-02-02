import { z } from "zod";

export const access = {
    Middleware: {
        Access: z.object({ code: z.string().trim() })
    },
    Email: z.object({ email: z.string().trim().email() }).strict()
} as const