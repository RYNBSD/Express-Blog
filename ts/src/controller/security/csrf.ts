import type { Request, Response } from "express";
import { KEYS } from "../../constant/index.js";
import { util } from "../../util/index.js";
import { StatusCodes } from "http-status-codes";

export const csrf = {
    async create(req: Request, res: Response) {
        // Check CSRF TOKEN already exists
        const checkSecret = req.session.csrf?.secret ?? "";
        if (checkSecret.length > 0)
            throw new Error("CSRF Token already exists");

        const { csrf } = util
        const { token, secret } = csrf.generate();

        req.session.csrf = { secret: "" };
        req.session.csrf.secret = secret;

        res.status(StatusCodes.OK)
            .setHeader(KEYS.HTTP.HEADERS.CSRF, token);
    },
    async delete(req: Request, res: Response) {
        req.session.csrf = { secret: "" };
        res.status(StatusCodes.OK);
    },
} as const;