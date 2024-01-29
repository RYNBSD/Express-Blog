import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { lib } from "../../lib/index.js";
import { schema } from "../../schema/index.js";

export const blog = {
    async all(req: Request, res: Response) {
        res.status(StatusCodes.OK).end();
    },
    async blog(req: Request, res: Response) {
        res.status(StatusCodes.OK).end();
    },
    async blogLikes(req: Request, res: Response) {
        res.status(StatusCodes.OK).end();
    },
    async blogComments(req: Request, res: Response) {
        res.status(StatusCodes.OK).end();
    },
    async like(req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const { Params } = schema.req.api.blog.Like
        const { blogId } = Params.parse(req.params);

        const { id: userId } = user.dataValues;
        const { BlogLikes } = model.db;

        const [_, created] = await BlogLikes.findOrCreate({
            attributes: ["id"],
            where: { likerId: userId, blogId },
            limit: 1,
            plain: true,
        });

        if (!created) {
            await BlogLikes.destroy({
                where: { likerId: userId, blogId },
                force: true,
            });
        }

        res.status(created ? StatusCodes.CREATED : StatusCodes.OK).end();
    },
    async createBlog(req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const { CreateBlog } = schema.req.api.blog;
        const { title, description } = CreateBlog.parse(req.body);

        const images = req.files;
        if (!(images instanceof Array)) throw new Error("Invalid images");

        const { id: userId } = user.dataValues;
        const buffers = images.map((image) => image.buffer);
        let uploadedImages: string[] = [];

        if (buffers.length > 0) {
            const { FileConverter, FileUploader } = lib.file;

            const converted = await new FileConverter(...buffers).convert();
            if (converted.length === 0) throw new Error("Invalid image types");

            const uploaded = await new FileUploader(...converted).upload();
            if (uploaded.length === 0) return next("Cen't upload images");

            uploadedImages = uploaded;
        }

        const { Blog, BlogImages } = model.db;
        const blog = await Blog.create(
            { title, description, bloggerId: userId },
            { fields: ["title", "description", "bloggerId"] }
        );

        const { id: blogId } = blog.dataValues;
        const promises = uploadedImages.map(
            async (image) =>
                await BlogImages.create(
                    { image, blogId },
                    { fields: ["image", "blogId"] }
                )
        );
        await Promise.all(promises);

        res.status(StatusCodes.CREATED).end();
    },
    async createComment(req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const { id: userId } = user.dataValues;

        const { Params, Body } = schema.req.api.blog.CreateComment;
        const { blogId } = Params.parse(req.params);

        const { comment } = Body.parse(req.body);

        const { BlogComments } = model.db;

        await BlogComments.create(
            { comment, blogId, commenterId: userId },
            { fields: ["comment", "blogId", "commenterId"] }
        );

        res.status(StatusCodes.CREATED).end();
    },
    async updateBlog(req: Request, res: Response) {
        res.status(StatusCodes.OK).end();
    },
    async updateComment(req: Request, res: Response) {
        res.status(StatusCodes.OK).end();
    },
    async deleteBlog(_: Request, res: Response, next: NextFunction) {
        const { Blog } = model.db;
        const { blog } = res.locals;
        if (!(blog instanceof Blog)) return next("Invalid local blog");

        const { id: blogId } = blog.dataValues;
        const { BlogImages } = model.db;
        const images = await BlogImages.findAll({
            attributes: ["image"],
            where: { blogId },
        });

        const uris = images.map((image) => image.dataValues.image);
        const { FileUploader } = lib.file;

        await Promise.all([
            FileUploader.remove(...uris),
            blog.destroy({ force: true }),
        ]);

        res.status(StatusCodes.OK).end();
    },
    async deleteComment(_: Request, res: Response, next: NextFunction) {
        const { BlogComments } = model.db;
        const { comment } = res.locals;
        if (!(comment instanceof BlogComments))
            return next("Invalid local comment");

        await comment.destroy({ force: true });

        res.status(StatusCodes.OK).end();
    },
} as const;
