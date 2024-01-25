import type { Request, Response, NextFunction } from "express"

export const blog = {
    async isBlogOwner(req: Request, res: Response, next: NextFunction) {
        
    },
    async isCommentOwner(req: Request, res: Response, next: NextFunction) {

    }
} as const