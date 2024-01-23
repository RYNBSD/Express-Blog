import { z } from "zod";
import { model } from "../model/index.js";

const { User } = model.db;

export const definitions = {
    Params: {
        UserId: z.object({ userId: z.string().trim().uuid() }).strict(),
    },
    Query: {
        LastBlogId: z.object({ lastBlogId: z.string().trim().uuid() }).strict(),
    },
    Local: {
        User: z.object({ user: z.instanceof(User) }).strict(),
    },
} as const;
