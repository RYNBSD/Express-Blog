import { Router } from "express";
import { handleAsync } from "../../util/fn.js";
import { middleware } from "../../middleware/index.js";
import { controller } from "../../controller/index.js";
import { config } from "../../config/index.js";
import { KEYS } from "../../constant/index.js";

export const user = Router();
const { api } = controller;
const { upload } = config;

user.get(
    "/:userId/info",
    handleAsync(middleware.hasUserUnregistered),
    handleAsync(api.user.info)
);

user.get(
    "/:userId/blogs",
    handleAsync(middleware.hasUserUnregistered),
    handleAsync(api.user.blogs)
);

user.put(
    "/",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered),
    upload.single(KEYS.GLOBAL.PICTURE),
    handleAsync(api.user.update)
);

user.delete(
    "/",
    handleAsync(middleware.hasUserRegistered),
    handleAsync(api.user.delete)
);
