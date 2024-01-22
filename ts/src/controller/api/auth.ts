import type { Request, Response } from "express";
import { schema } from "../../schema/index.js";
import { util } from "../../util/index.js";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { lib } from "../../lib/index.js";

export const auth = {
    async signUp(req: Request, res: Response) {
        const picture = req.file;
        if (picture === undefined) throw new Error("Picture required");

        const { FileConverter, FileUploader } = lib.file;

        const converted = await new FileConverter(picture.buffer).convert();
        if (converted.length === 0) throw new Error("Invalid picture");

        const uploaded = await new FileUploader(...converted).upload();
        if (uploaded.length === 0) throw new Error("Can't save picture");

        const { SignUp } = schema.req.auth;
        const { username, email, password } = SignUp.parse(req.body);

        const { bcrypt } = util;
        const hash = bcrypt.hash(password);

        const { User } = model.db;
        await User.create(
            {
                username,
                email,
                password: hash,
                picture: uploaded[0]!,
            },
            { fields: ["username", "email", "password", "picture"] }
        );

        res.status(StatusCodes.CREATED);
    },
    async signIn(req: Request, res: Response) {
        const { SignIn } = schema.req.auth
        const { email, password } = SignIn.parse(req.body)

        const { User } = model.db
        const user = await User.findOne({
            attributes: ["id", "username", "picture", "password"],
            where: { email },
            limit: 1,
            plain: true,
        })
        if (user === null)
            throw new Error("User not found")

        const hash = user.dataValues.password
        const { bcrypt } = util
        const isPasswordValid = bcrypt.compare(password, hash)
        if (!isPasswordValid)
            throw new Error("Password incorrect")

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete user.dataValues.password

        res.status(StatusCodes.OK).json({
            user: user.dataValues
        });
    },
    async signOut(req: Request, res: Response) {
        req.session.access = { key: "", iv: "" };
        req.session.csrf = { secret: "" };
        req.session.user = { id: "" };

        res.status(StatusCodes.OK);
    },
    async me(req: Request, res: Response) {
        res.status(StatusCodes.OK);
    },
    async forgotPassword(req: Request, res: Response) {
        res.status(StatusCodes.OK);
    },
} as const;
