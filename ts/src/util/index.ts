const [{ bcrypt }, { csrf }, { jwt }, fn] = await Promise.all([
    import("./bcrypt.js"),
    import("./csrf.js"),
    import("./jwt.js"),
    import("./fn.js"),
]);

export const util = {
    bcrypt,
    csrf,
    jwt,
    ...fn,
} as const;