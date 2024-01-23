import type { NextFunction, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { schema } from "../../schema/index.js";
import { lib } from "../../lib/index.js";

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
    async update(req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const { Update } = schema.req.user;
        const { username, email } = Update.parse(req.body);

        let newPicture = user.dataValues.picture as string;
        const picture = req.file;
        if (picture !== undefined) {
            const { FileConverter, FileUploader } = lib.file;

            const converted = await new FileConverter(picture.buffer).convert();
            if (converted.length === 0) throw new Error("Invalid picture");

            const uploaded = await new FileUploader(...converted).upload();
            if (uploaded.length === 0) return next("Can't upload picture");

            await FileUploader.remove(newPicture);
            newPicture = uploaded[0]!;
        }

        await user.update({ username, email, picture: newPicture });
        res.status(StatusCodes.OK).end();
    },
    async delete(_: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        await user.destroy({ force: true });
        res.status(StatusCodes.OK).end();
    },
} as const;
