import type { IncomingHttpHeaders } from "node:http";
import type { Request, Response, NextFunction } from "express";
import { VALUES } from "../constant/index.js";
import { StatusCodes } from "http-status-codes";

export function handleAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST)
                .json({
                    message: error instanceof Error ? error.message : error,
                })
                .end();
        }
    };
}

/**
 * Get current Time in seconds
 * @param [add=0] - In milliseconds
 * */
export function nowInSecond(add: number = 0) {
    return Math.floor((Date.now() + add) / VALUES.TIME.SECOND);
}

export function getHeader(headers: IncomingHttpHeaders, key: string) {
    return headers[key.toLowerCase()] ?? "";
}
