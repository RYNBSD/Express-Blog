import type { Request, Response, NextFunction } from "express"
import { util } from "../../util/index.js";
import { KEYS } from "../../constant/index.js";

export const security = {
    async csrf(req: Request, _res: Response, next: NextFunction) {
        const { getHeader, csrf } = util

        const token = getHeader(req.headers, KEYS.HTTP.HEADERS.CSRF);
        if (token.length === 0)
            throw new Error("Empty CSRF token");
    
        if (token instanceof Array)
            throw new Error("Too many CSRF token");
    
        const secret = req.session.csrf?.secret ?? "";
        if (secret.length === 0)
            throw new Error("Empty CSRF secret");
    
        req.session.csrf = { secret: "" };
        if (csrf.verify(secret, token)) return next();
        throw new Error("Invalid CSRF");
    }
} as const