import type { Request, Response } from "express"
import { schema } from "../../schema/index.js"
import { util } from "../../util/index.js"
import { StatusCodes } from "http-status-codes"
import { model } from "../../model/index.js"

export const auth =  {
    async signUp(req: Request, res: Response) {
        const picture = req.file
        if (picture === null)
            throw new Error("Picture required")
        
        const { SignUp } = schema.req.auth
        const { username, email, password } = SignUp.parse(req.body) 

        const { bcrypt } = util
        const hash = bcrypt.hash(password)

        const { User } = model.db
        await User.create()

        res.status(StatusCodes.CREATED)
    },
    async signIn(req: Request, res: Response) {

        res.status(StatusCodes.OK);
    },
    async signOut(req: Request, res: Response) {
        req.session.access = { key: "", iv: "" }
        req.session.csrf = { secret: "" }
        req.session.user = { id: "" }

        res.status(StatusCodes.OK);
    },
    async me(req: Request, res: Response) {

        res.status(StatusCodes.OK);
    },
    async forgotPassword(req: Request, res: Response) {

        res.status(StatusCodes.OK);
    },
} as const