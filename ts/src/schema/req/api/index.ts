const [{ auth }, { user }] = await Promise.all([
    import("./auth.js"),
    import("./user.js"),
]);

export const api = {
    auth,
    user,
} as const;
