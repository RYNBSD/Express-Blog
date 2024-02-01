import type { NextFunction, Request, Response } from "express";
import { Op, QueryTypes } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { lib } from "../../lib/index.js";
import { schema } from "../../schema/index.js";

export const blog = {
    async all(_: Request, res: Response) {
        const blogs = await sequelize.query(
            `
            SELECT b.id, b.title, b.description, ARRAY_AGG(bi.image) AS images, u.id AS "bloggerId", u.username, u.picture,
            COUNT(bl.id) AS likes, COUNT(bc.id) AS comments
            FROM blog b
            INNER JOIN "user" u ON u."id" = b."bloggerId"
            LEFT JOIN "blogImages" bi ON bi."blogId" = b."id"
            LEFT JOIN "blogLikes" bl ON bl."blogId" = b."id"
            LEFT JOIN "blogComments" bc ON bc."blogId" = b."id"
            GROUP BY b.id, b.title, b.description, u.id, u.username, u.picture
        `,
            {
                type: QueryTypes.SELECT,
                raw: true,
            }
        );

        res.status(blogs.length === 0 ? StatusCodes.NO_CONTENT : StatusCodes.OK)
            .json({ blogs })
            .end();
    },
    async blog(req: Request, res: Response) {
        const { Blog } = schema.req.api.blog;
        const { blogId } = Blog.parse(req.params);

        const blog = await sequelize.query(
            `
            SELECT b.id, b.title, b.description, ARRAY_AGG(bi.image) AS images, u.id AS "bloggerId", u.username, u.picture, COUNT(bl.id) AS likes, COUNT(bc.id) AS comments FROM blog b
            INNER JOIN "user" u ON u."id" = b."bloggerId"
            LEFT JOIN "blogLikes" bl ON bl."blogId" = b."id"
            LEFT JOIN "blogComments" bc ON bc."blogId" = b."id"
            LEFT JOIN "blogImages" bi ON bi."blogId" = b."id"
            WHERE b.id = $blogId
            GROUP BY b.id, b.title, b.description, u.id, u.username, u.picture
        `,
            {
                type: QueryTypes.SELECT,
                plain: true,
                raw: true,
                bind: { blogId },
            }
        );
        if (blog === null) throw new Error("Blog not found");

        res.status(StatusCodes.OK).json({ blog }).end();
    },
    async blogLikes(req: Request, res: Response) {
        const { BlogLikes } = schema.req.api.blog;
        const { blogId } = BlogLikes.parse(req.params);

        const likers = await sequelize.query(
            `
            SELECT u.username, u.picture FROM "blogLikes" bl
            INNER JOIN "user" u ON u.id = bl."likerId"
            WHERE bl."blogId"=':blogId'
        `,
            {
                type: QueryTypes.SELECT,
                raw: true,
                bind: { blogId },
            }
        );

        res.status(
            likers.length === 0 ? StatusCodes.NO_CONTENT : StatusCodes.OK
        )
            .json({ likers })
            .end();
    },
    async blogComments(req: Request, res: Response) {
        const { BlogComments } = schema.req.api.blog;
        const { blogId } = BlogComments.parse(req.params);

        const commentators = await sequelize.query(
            `
            SELECT u.username, u.picture, bc.comment FROM "blogComments" bc
            INNER JOIN "user" u ON u.id = bc."commenterId"
            WHERE bc."blogId" = ':blogId'
        `,
            {
                type: QueryTypes.SELECT,
                raw: true,
                bind: { blogId },
            }
        );

        res.status(
            commentators.length === 0 ? StatusCodes.NO_CONTENT : StatusCodes.OK
        )
            .json({ commentators })
            .end();
    },
    async like(req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const { Params } = schema.req.api.blog.Like;
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
    async updateBlog(req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const { Body, Params } = schema.req.api.blog.UpdateBlog;
        const { title, description, deletedImages } = Body.parse(req.body);
        const { blogId } = Params.parse(req.params);

        const images = req.files;
        if (!(images instanceof Array)) throw new Error("Invalid images");

        let uploadedImages: string[] = [];
        if (images.length > 0) {
            const { FileConverter, FileUploader } = lib.file;
            const buffers = images.map((image) => image.buffer);

            const converted = await new FileConverter(...buffers).convert();
            if (converted.length === 0) throw new Error("Invalid image type");

            const uploaded = await new FileUploader(...converted).upload();
            if (uploaded.length === 0) return next("Can't upload your images");

            uploadedImages = uploaded;
        }

        const { BlogImages, Blog } = model.db;

        const promises = {
            deletedImagesUri: deletedImages.map((id) =>
                BlogImages.findByPk(id, {
                    attributes: ["image"],
                    limit: 1,
                    plain: true,
                })
            ),
            imageDeletion: BlogImages.destroy({
                where: { [Op.or]: { id: deletedImages } },
                force: true,
            }),
            imageInsertion: uploadedImages.map((image) =>
                BlogImages.create({ blogId, image })
            ),
            updateBlog: Blog.update(
                { title, description },
                { where: { id: blogId } }
            ),
        } as const;

        const imagesUri = await Promise.all(promises.deletedImagesUri);

        const uris: string[] = imagesUri
            .filter((image) => image !== null)
            .map((image) => image!.dataValues.image);

        const { FileUploader } = lib.file;
        const removeImages = FileUploader.remove(...uris);

        await Promise.all([
            removeImages,
            promises.imageDeletion,
            ...promises.imageInsertion,
            promises.updateBlog,
        ]);

        res.status(StatusCodes.OK).end();
    },
    async updateComment(req: Request, res: Response, next: NextFunction) {
        const { User } = model.db;
        const { user } = res.locals;
        if (!(user instanceof User)) return next("Invalid local user");

        const { Body, Params } = schema.req.api.blog.UpdateComment;
        const { comment } = Body.parse(req.body);
        const { blogId, commentId } = Params.parse(req.params);

        const { id: userId } = user.dataValues;
        const { BlogComments } = model.db;

        await BlogComments.update(
            { comment },
            { where: { id: commentId, blogId, commenterId: userId } }
        );

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
