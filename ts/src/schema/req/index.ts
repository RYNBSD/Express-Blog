const [{ auth }] = await Promise.all([import("./auth.js")]);

export const req = {
    auth,
} as const;
