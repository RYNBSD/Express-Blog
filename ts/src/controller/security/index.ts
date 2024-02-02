const [{ csrf }, { access }] = await Promise.all([
    import("./csrf.js"),
    import("./access.js"),
]);

export const security = {
    csrf,
    access,
} as const;
