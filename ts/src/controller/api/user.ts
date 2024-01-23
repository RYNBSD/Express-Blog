import type { NextFunction, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { schema } from "../../schema/index.js";

export const user = {
    async info(req: Request, res: Response) {
        const {
            Info: { Params },
        } = schema.req.user;

        const { userId } = Params.parse(req.params);

        const { User } = model.db;
        const user = await User.findByPk(userId, {
            attributes: ["id", "username", "picture"],
            limit: 1,
            plain: true,
        });
        if (user === null) throw new Error("User not found");

        res.status(StatusCodes.OK)
            .json({
                user: user.dataValues,
            })
            .end();
    },
    async blogs(_req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const blogs = await sequelize.query(``, {
            type: QueryTypes.SELECT,
            raw: true,
            bind: {
                userId: user.dataValues.id,
            },
        });

        res.status(blogs.length === 0 ? StatusCodes.NO_CONTENT : StatusCodes.OK)
            .json({
                blogs,
            })
            .end();
    },
} as const;
