import { z } from "zod";
import { Blog } from "../../db.js";

const BlogId = z.object({ blogId: z.string().trim().uuid() }).strict();
const CommentId = z.object({ commentId: z.number().min(1) }).strict();

export const blog = {
    Middleware: {
        IsBlogOwner: {
            Params: BlogId,
        },
        IsCommentOwner: {
            Params: z.object({}).merge(BlogId).merge(CommentId).strict(),
        },
    },
    CreateBlog: Blog.omit({ bloggerId: true, id: true }),
    CreateComment: {
        Params: BlogId,
        Body: z.object({ comment: z.string().trim().min(1).max(255) }).strict(),
    },
} as const;
