import type { NextFunction, Request, Response } from "express"
import express from "express"
import compression from "compression"
import timeout from "connect-timeout"
import cors from "cors"
import { StatusCodes } from "http-status-codes"
import responseTime from "response-time"
import { ENV, KEYS } from "./src/constant/index.js";
import { router } from "./src/router/index.js"
import path from "path"

const app = express()
app.enable("json escape")
app.set("env", ENV.NODE.ENV)

app.use(timeout("5s"))
app.use(cors())
app.use(responseTime())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

global.IS_PRODUCTION = ENV.NODE.ENV === "production"
global.__root = process.cwd()

app.use("/api", router)
app.use(express.static(path.join(__root, KEYS.PUBLIC)))
app.use("*", (_, res) => res.status(StatusCodes.NOT_FOUND))
app.use((error: Error, _req: Request, _res: Response, next: NextFunction) => next(error))

app.listen(ENV.NODE.PORT, () => {
    console.log("Listing");
})