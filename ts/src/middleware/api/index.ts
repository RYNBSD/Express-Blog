const [{ blog }] = await Promise.all([import("./blog.js")])

export const api = {
    blog,
} as const