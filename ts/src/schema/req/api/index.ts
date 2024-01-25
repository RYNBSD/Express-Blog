const [{ auth }, { user }, { blog }] = await Promise.all([
    import("./auth.js"),
    import("./user.js"),
    import("./blog.js")
]);

export const api = {
    auth,
    user,
    blog,
} as const;
