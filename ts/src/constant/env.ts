import { config } from "dotenv";
config();

export const ENV = {
    NODE: {
        PORT: process.env.PORT,
        ENV: process.env.NODE_ENV,
    },
    SEQUELIZE: {
        DB_DATABASE: process.env.DB_DATABASE,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_HOST: process.env.DB_HOST,
    },
    JWT: {
        SECRET: process.env.JWT_SECRET,
    },
} as const;
