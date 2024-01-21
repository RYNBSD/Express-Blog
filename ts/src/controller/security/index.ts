const [{ csrf }] = await Promise.all([import("./csrf.js")])

export const security = {
    csrf,
} as const