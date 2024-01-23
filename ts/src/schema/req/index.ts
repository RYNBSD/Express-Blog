const [{ auth }, { user }] = await Promise.all([
    import("./auth.js"),
    import("./user.js"),
]);

export const req = {
    auth,
    user,
} as const;
