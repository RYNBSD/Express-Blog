export const [{ ENV }, { KEYS }, { VALUES }] = await Promise.all([
    import("./env.js"),
    import("./keys.js"),
    import("./values.js"),
]);
