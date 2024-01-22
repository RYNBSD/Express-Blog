import type { NextFunction, Request, Response } from "express";
import express from "express";
import compression from "compression";
import hpp from "hpp";
import session from "express-session";
import morgan from "morgan";
import helmet from "helmet";
import timeout from "connect-timeout";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import responseTime from "response-time";
import { ENV, KEYS, VALUES } from "./src/constant/index.js";
import { config } from "./src/config/index.js";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
app.disable("x-powered-by");
app.disable("trust proxy");
app.enable("json escape");
app.enable("view cache");
app.set("env", ENV.NODE.ENV);

app.use(timeout("5s"));
app.use(responseTime());
app.use(cors());
app.use(rateLimit());

global.IS_PRODUCTION = ENV.NODE.ENV === "production";
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
global.__root = process.cwd();

if (!IS_PRODUCTION) {
    const errorhandler = (await import("errorhandler")).default;
    app.use(errorhandler({ log: true }));
    await import("colors");
}

app.use(morgan(IS_PRODUCTION ? "combined" : "dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(hpp());
app.use(
    session({
        secret: ENV.SESSION.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: VALUES.TIME.DAY,
            httpOnly: IS_PRODUCTION,
            sameSite: IS_PRODUCTION,
            secure: IS_PRODUCTION,
            path: "/",
        },
    })
);

const { db } = config;
await db.connect();
const { router } = await import("./src/router/index.js");
await db.init();

app.use("/", router);
app.use(express.static(path.join(__root, KEYS.GLOBAL.PUBLIC)));
app.use("*", (_, res) => res.status(StatusCodes.NOT_FOUND));
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) =>
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
    })
);

process.on("unhandledRejection", (error) => {
    throw error;
});

process.on("uncaughtException", async (error) => {
    console.error(error);

    const { db } = config;
    await db.close();

    process.exit(1);
});

app.listen(ENV.NODE.PORT, () => {
    if (!IS_PRODUCTION) console.log("Starting".bgGreen.white);
});
