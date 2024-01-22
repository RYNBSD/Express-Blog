import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { serialize } from "cookie";
import { schema } from "../../schema/index.js";
import { util } from "../../util/index.js";
import { model } from "../../model/index.js";
import { lib } from "../../lib/index.js";
import { KEYS, VALUES } from "../../constant/index.js";

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

        res.status(StatusCodes.CREATED).end();
    },
    async signIn(req: Request, res: Response) {
        const { SignIn } = schema.req.auth;
        const { email, password } = SignIn.parse(req.body);

        const { User } = model.db;
        const user = await User.findOne({
            attributes: ["id", "username", "picture", "password"],
            where: { email },
            limit: 1,
            plain: true,
        });
        if (user === null) throw new Error("User not found");

        const hash = user.dataValues.password;
        const { bcrypt } = util;
        const isPasswordValid = bcrypt.compare(password, hash);
        if (!isPasswordValid) throw new Error("Password incorrect");

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete user.dataValues.password;

        const { jwt } = util;
        const newToken = jwt.sign(user.dataValues.id);
        req.session.user = { id: user.dataValues.id };

        res.status(StatusCodes.OK)
            .setHeader(
                "Set-Cookie",
                serialize(KEYS.COOKIE.JWT, newToken, {
                    httpOnly: IS_PRODUCTION,
                    secure: IS_PRODUCTION,
                    sameSite: IS_PRODUCTION,
                    path: "/",
                    maxAge: VALUES.TIME.MONTH,
                })
            )
            .json({
                user: user.dataValues,
            })
            .end();
    },
    async signOut(req: Request, res: Response) {
        req.session.access = { key: "", iv: "" };
        req.session.csrf = { secret: "" };
        req.session.user = { id: "" };

        res.status(StatusCodes.OK).end();
    },
    async me(req: Request, res: Response) {
        const { getHeader } = util;
        const authorization = getHeader(req.headers, "authorization");
        if (authorization instanceof Array || authorization.length === 0)
            throw new Error("Unauthorize");

        const token = authorization.split(" ")[1] ?? "";
        if (token.length === 0) throw new Error("Unauthorized");

        const { jwt } = util;
        const id = (jwt.verify(token) as string | null) ?? "";
        if (id.length === 0) throw new Error("Invalid token");

        const { User } = model.db;
        const user = await User.findOne({
            attributes: ["id", "username", "picture"],
            where: { id },
            limit: 1,
            plain: true,
        });
        if (user === null) throw new Error("User not found");

        const newToken = jwt.sign(id);
        req.session.user = { id };

        res.status(StatusCodes.OK)
            .setHeader(
                "Set-Cookie",
                serialize(KEYS.COOKIE.JWT, newToken, {
                    httpOnly: IS_PRODUCTION,
                    secure: IS_PRODUCTION,
                    sameSite: IS_PRODUCTION,
                    path: "/",
                    maxAge: VALUES.TIME.MONTH,
                })
            )
            .json({
                user: user.dataValues,
            })
            .end();
    },
} as const;
