import { rm, writeFile } from "node:fs/promises";
import { util } from "../../util/index.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { KEYS } from "../../constant/index.js";

export class FileUploader {
    private readonly files: Buffer[];

    constructor(...files: Buffer[]) {
        this.files = files;
    }

    private generateUniqueFileName() {
        return util.nowSecond() + "_" + randomUUID() + ".webp";
    }

    private async write(file: Buffer) {
        const uri = this.generateUniqueFileName();
        const fullPath = path.join(__root, KEYS.PUBLIC, uri);
        await writeFile(fullPath, file);
        return uri;
    }

    async upload() {
        return await Promise.all(
            this.files.map(async (file) => await this.write(file))
        );
    }

    static async remove(...paths: string[]) {
        await Promise.all(
            paths.map(async (path) => await rm(path, { force: true }))
        );
    }
}
