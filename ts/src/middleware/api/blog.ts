import type { Request, Response, NextFunction } from "express";
import { model } from "../../model/index.js";
import { schema } from "../../schema/index.js";

export const blog = {
    async isBlogOwner(req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const {
            IsBlogOwner: { Params },
        } = schema.req.api.blog.Middleware;
        const { blogId } = Params.parse(req.params);

        const { id: userId } = user.dataValues;
        const { Blog } = model.db;

        const blog = await Blog.findOne({
            where: { id: blogId, bloggerId: userId },
            limit: 1,
            plain: true,
        });
        if (blog === null) throw new Error("Not Blog Owner");

        res.locals.blog = blog;
        return next();
    },
    async isCommentOwner(req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const {
            IsCommentOwner: { Params },
        } = schema.req.api.blog.Middleware;
        const { blogId, commentId } = Params.parse(req.params);

        const { id: userId } = user.dataValues;
        const { BlogComments } = model.db;

        const comment = await BlogComments.findOne({
            attributes: ["id"],
            where: { id: commentId, blogId, commenterId: userId },
            limit: 1,
            plain: true,
        });
        if (comment === null) throw new Error("Not Comment Owner");


        res.locals.comment = comment;
        return next();
    },
} as const;
