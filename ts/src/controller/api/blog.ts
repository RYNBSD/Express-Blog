import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { lib } from "../../lib/index.js";

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
    async like(req: Request, res: Response) {
        res.status(StatusCodes.OK).end();
    },
    async createBlog(req: Request, res: Response) {
        res.status(StatusCodes.CREATED).end();
    },
    async createComment(req: Request, res: Response) {
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
