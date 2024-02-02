import { z } from "zod";
import { Blog } from "../../db.js";

const BlogId = z.object({ blogId: z.string().trim().uuid() }).strict();
const CommentId = z.object({ commentId: z.number().min(1) }).strict();
const DeletedImages = z
    .object({
        deletedImages: z.union([z.string().array(), z.string()]).optional(),
    })
    .strict();

export const blog = {
    Middleware: {
        IsBlogOwner: {
            Params: BlogId,
        },
        IsCommentOwner: {
            Params: z.object({}).merge(BlogId).merge(CommentId).strict(),
        },
    },
    Blog: BlogId,
    BlogLikes: BlogId,
    BlogComments: BlogId,
    Like: {
        Params: BlogId,
    },
    CreateBlog: Blog.omit({ bloggerId: true, id: true }),
    CreateComment: {
        Params: BlogId,
        Body: z.object({ comment: z.string().trim().min(1).max(255) }).strict(),
    },
    UpdateBlog: {
        Body: Blog.omit({ id: true, bloggerId: true })
            .merge(DeletedImages)
            .strict(),
        Params: BlogId,
    },
    UpdateComment: {
        Body: z.object({ comment: z.string().trim().min(1).max(255) }).strict(),
        Params: z.object({}).merge(BlogId).merge(CommentId).strict(),
    },
} as const;
