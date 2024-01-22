export const KEYS = {
    HTTP: {
        HEADERS: {
            CSRF: "X-CSRF-Token",
            JWT: "X-JWT-Token",
            USER_ID: "X-User-Id",
        },
    },
    COOKIE: {
        JWT: "jwt_token",
    },
    GLOBAL: {
        PUBLIC: "public",
    },
} as const