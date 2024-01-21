// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SessionData } from "express-session";

interface Csrf {
    csrf: {
        secret: string;
    };
}

interface User {
    user: {
        id: string;
    };
}

interface Access {
    access: {
        key: string;
        iv: string;
    };
}

declare module "express-session" {
    interface SessionData extends Csrf, User, Access {}
}
