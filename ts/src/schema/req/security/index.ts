const [{ access }] = await Promise.all([import("./access.js")])

export const security = {
    access
} as const