import { z } from "zod";

export const definitions = {
    Params: {
        UserId: z.object({ userId: z.string().trim().uuid() }).strict(),
    },
    Query: {
        LastBlogId: z.object({ lastBlogId: z.string().trim().uuid() }).strict(),
    },
    Local: {},
} as const;
