const [fn, { api }, { security }] = await Promise.all([import("./fn.js"), import("./api/index.js"), import("./security/index.js")])

export const middleware = {
    api,
    security,
    ...fn,
} as const