const [fn] = await Promise.all([import("./fn.js")])

export const middleware = {
    ...fn,
} as const