import { Sequelize } from "sequelize";

export const db = {
    async connect() {
        global.sequelize = new Sequelize("blog", "postgres", "password", {
            host: "localhost",
            dialect: "postgres",
            logging: (sql, timing) => {
                if (IS_PRODUCTION) return false;

                console.log(`${sql}`.black.bgWhite);
                console.log(`${timing} ms`.bgYellow.black);
            },
            benchmark: !IS_PRODUCTION,
        });
        await global.sequelize.authenticate();
    },
    async close() {
        await global.sequelize.close();
    },
    async init() {
        await global.sequelize.sync({ alter: !IS_PRODUCTION });
    },
} as const;