import sharp from "sharp";
import fileType from "file-type";

export class FileConverter {
    private readonly files: Buffer[] = [];
    private readonly EXTENSIONS = {
        IMAGES: ["png", "jpg", "jpeg", "webp", "avif"],
    } as const;

    constructor(...files: Buffer[]) {
        this.files = files;
    }

    private async format(file: Buffer) {
        return (await fileType.fromBuffer(file))?.ext ?? "";
    }

    private async toWebp(image: Buffer) {
        const ext = await this.format(image);
        const isImage = this.EXTENSIONS.IMAGES.includes(ext);

        return isImage
            ? await sharp(image)
                  .webp({ quality: 100, alphaQuality: 100 })
                  .resize({ width: 1280, height: 720, fit: "cover" })
                  .toBuffer()
            : null;
    }

    async convert() {
        return (
            await Promise.allSettled(
                this.files.map(async (file) => await this.toWebp(file))
            )
        ).filter(
            (promise) =>
                promise.status === "fulfilled" && promise.value !== null
        );
    }
}
