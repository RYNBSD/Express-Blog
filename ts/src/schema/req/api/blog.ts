import { z } from "zod";

export const blog = {
    Middleware: {
        IsBlogOwner: {
            Params: z.object({ blogId: z.string().trim().uuid() }).strict(),
        },
        IsCommentOwner: {
            Params: z
                .object({
                    blogId: z.string().trim().uuid(),
                    commentId: z.number().min(1),
                })
                .strict(),
        },
    },
} as const;
