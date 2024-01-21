const [{ upload }] = await Promise.all([import("./upload.js")]);

export const config = {
    upload,
} as const;
