import { Router } from "express";
import { controller } from "../../controller/index.js";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { config } from "../../config/index.js";

export const access = Router();

const { upload } = config
const { handleAsync } = util;
const { security } = controller;

access.post(
    "/email",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserUnregistered),
    upload.none(),
    handleAsync(security.access.email),
);
