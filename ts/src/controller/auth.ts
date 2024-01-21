import type { Request, Response } from "express"
import { schema } from "../schema/index.js"
import { util } from "../util/index.js"
import { StatusCodes } from "http-status-codes"

export const auth =  {
    async signUp(req: Request, res: Response) {
        const { SignUp } = schema.req.auth
        const { username, email, password } = SignUp.parse(req.body) 

        const { bcrypt } = util
        const hash = bcrypt.hash(password)

        res.status(StatusCodes.CREATED)
    },
    async signIn(req: Request, res: Response) {

    },
    async signOut(req: Request, res: Response) {

    },
    async me(req: Request, res: Response) {

    },
    async forgotPassword(req: Request, res: Response) {

    },
} as const