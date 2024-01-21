import { config } from "dotenv";
config()

export const ENV = {
    NODE: {
        PORT: process.env.PORT,
        ENV: process.env.NODE_ENV,
    },
    JWT:{ 
        SECRET: process.env.JWT_SECRET
    }
} as const