/* eslint-disable no-var */
import type { Sequelize } from "sequelize";

declare global {
    var IS_PRODUCTION: boolean;
    var sequelize: Sequelize;
    var __root: string;

    namespace NodeJS {
        interface ProcessEnv {
            PORT: number | `${number}`;
            NODE_ENV: "production" | "development";
            COOKIE_SECRET: string;
            JWT_SECRET: string;
            SESSION_SECRET: string;

            DB_DATABASE: string;
            DB_USERNAME: string;
            DB_PASSWORD: string;
            DB_HOST: string;

            MAIL_USER: string;
            MAIL_PASS: string;
        }
    }
}

export {};
