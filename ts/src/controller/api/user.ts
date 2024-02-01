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
        } = schema.req.api.user;

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
    async blogs(req: Request, res: Response) {
        const { Params } =  schema.req.api.user.Blogs
        const { userId } = Params.parse(req.params);

        const blogs = await sequelize.query(
            `
            SELECT b.title, b.description, ARRAY_AGG(bi.image) AS images, u.username, u.picture, COUNT(bl.id) AS likes, COUNT(bc.id) AS comments FROM blog b
            LEFT JOIN "user" u ON u."id" = b."bloggerId"
            LEFT JOIN "blogLikes" bl ON bl."blogId" = b."id"
            LEFT JOIN "blogComments" bc ON bc."blogId" = b."id"
            LEFT JOIN "blogImages" bi ON bi."blogId" = b."id"
            WHERE u.id = $userId
            GROUP BY b.title, b.description, u.username, u.picture
        `,
            {
                type: QueryTypes.SELECT,
                raw: true,
                bind: {
                    userId,
                },
            }
        );

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

        const { Update } = schema.req.api.user;
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

        const userId = user.dataValues.id;
        const images = await sequelize.query<{ image: string }>(
            `
            SELECT bi.image 
            FROM "user" u
            INNER JOIN blog b ON b."bloggerId" = u.id
            INNER JOIN "blogImages" bi ON bi."blogId" = b.id
            WHERE u.id = '94dce27a-d1b5-4f4e-9fa4-f2c3087e2d23';
        `,
            {
                type: QueryTypes.SELECT,
                raw: true,
                bind: {
                    userId,
                },
            }
        );

        const { FileUploader } = lib.file;
        const uris = images.map((image) => image.image);
        const { picture } = user.dataValues;

        await FileUploader.remove(...uris, picture);

        await user.destroy({ force: true });
        res.status(StatusCodes.OK).end();
    },
} as const;
