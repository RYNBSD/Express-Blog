import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { util } from "../../util/index.js";
import { model } from "../../model/index.js";
import { lib } from "../../lib/index.js";
import { KEYS } from "../../constant/index.js";
import { schema } from "../../schema/index.js";

export const access = {
    async email(req: Request, res: Response) {
        const { Email } = schema.req.security.access
        const { email } = Email.parse(req.body);

        const { User } = model.db;
        const user = await User.findOne({
            attributes: ["id"],
            where: { email },
            plain: true,
            limit: 1,
        });
        if (user === null) throw new Error("User not found");

        const { access } = util;
        const { token, iv, key, code } = access.token(user.dataValues.id);
        const { Mail } = lib;

        await new Mail(email, "Reset password", `code: ${code}`).send();

        req.session.access = { key, iv };
        res.status(StatusCodes.CREATED)
            .setHeader(KEYS.HTTP.HEADERS.ACCESS_TOKEN, token)
            .end();
    },
} as const;
