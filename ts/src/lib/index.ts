const [{ FileConverter }, { FileUploader }] = await Promise.all([
    import("./file/converter.js"),
    import("./file/uploader.js"),
]);

export const lib = {
    file: {
        FileConverter,
        FileUploader,
    },
};
