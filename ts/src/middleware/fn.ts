import type { Request, Response, NextFunction } from "express";
import { KEYS } from "../constant/index.js";
import { util } from "../util/index.js";
import { model } from "../model/index.js";

const isUUID = (await import("validator/lib/isUUID.js")).default.default;

export async function hasUserRegistered(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { getHeader } = util;
    const userId = getHeader(req.headers, KEYS.HTTP.HEADERS.USER_ID);
    if (userId.length === 0) throw new Error("Empty User Id (header)");

    if (userId instanceof Array) throw new Error("Too many users id");

    if (isUUID(userId, 4) === false)
        throw new Error("Invalid User id type (uuid)");

    const sessionUserId = req.session.user?.id ?? "";
    if (sessionUserId.length === 0) throw new Error("Empty User Id (session)");

    if (isUUID(sessionUserId, 4) === false) {
        req.session.user = { id: "" };
        return next("Invalid session user id");
    }

    if (userId !== sessionUserId) throw new Error("Invalid User Id");

    const { User } = model.db;
    const user = await User.findByPk(userId, {
        plain: true,
        limit: 1,
    });

    if (user instanceof User) {
        res.locals.user = user;
        return next();
    }
    req.session.user = { id: "" };
    return next("User not found");
}

/**
 * If the user is sign in we will check his userId and stored in local then next
 *
 * If the user is not sign in then next
 *
 * Otherwise error
 */
export async function hasUserUnregistered(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { getHeader } = util;
    const userId = getHeader(req.headers, KEYS.HTTP.HEADERS.USER_ID);
    if (userId instanceof Array) throw new Error("Too many user id");
    if (userId.length === 0) return next();

    if (isUUID(userId, 4) === false)
        throw new Error("Invalid user id type (uuid)");

    const { User } = model.db;
    const user = await User.findByPk(userId, {
        limit: 1,
        plain: true,
    });
    if (user === null) throw new Error("User not found");

    const sessionUserId = req.session.user?.id ?? "";
    if (sessionUserId.length === 0)
        return next("User id not stored in session");
    if (userId !== sessionUserId) {
        req.session.user = { id: "" };
        return next(
            "User is logged in, in client and not unknown for the server"
        );
    }

    res.locals.user = user;
    return next();
}
