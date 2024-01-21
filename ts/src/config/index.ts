const [{ upload }, { db }] = await Promise.all([import("./upload.js"), import("./db.js")]);

export const config = { upload, db } as const;
