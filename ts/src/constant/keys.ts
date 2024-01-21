export const KEYS = {
    HTTP: {
        HEADERS: {
            CSRF: "X-CSRF-Token",
            JWT: "X-JWT-Token",
            METHOD_OVERRIDE: "X-HTTP-Method-Override",
            NO_COMPRESSION: "X-No-Compression",
            USER_ID: "X-User-Id",
            RESPONSE_TIME: "X-Response-Time",
            ACCESS_TOKEN: "Access-Token",
        },
        METHODS: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
    COOKIE: {
        JWT: "jwt_token",
    },
    GLOBAL: {
        PUBLIC: "public",
        PICTURE: "picture",
        IMAGE: "image",
    },
}