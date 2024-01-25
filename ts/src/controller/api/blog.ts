import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

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
    async deleteBlog(req: Request, res: Response) {
        res.status(StatusCodes.OK).end();
    },
    async deleteComment(req: Request, res: Response) {
        res.status(StatusCodes.OK).end();
    },
} as const;
