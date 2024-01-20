import type { Request, Response, NextFunction } from "express";

export const util = {
    async handleAsync(fn: HandleAsyncFn) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await fn(req, res, next);
            } catch (error) {
                next(error);
            }
        };
    },
    nowSecond: () => Math.floor(Date.now() / 1000)
};

type HandleAsyncFn = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;
