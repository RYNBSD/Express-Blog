import { Router } from "express";
import { util } from "../../util/index.js";
import { config } from "../../config/index.js";
import { controller } from "../../controller/index.js";
import { middleware } from "../../middleware/index.js";
import { KEYS } from "../../constant/index.js";

export const auth = Router();

const { handleAsync } = util;
const { upload } = config;
const { api } = controller;

auth.post(
    "/sign-up",
    handleAsync(middleware.hasUserUnregistered),
    handleAsync(middleware.security.csrf),
    upload.single(KEYS.GLOBAL.PICTURE),
    handleAsync(api.auth.signUp)
);

auth.post(
    "/sign-in",
    handleAsync(middleware.hasUserUnregistered),
    handleAsync(middleware.security.csrf),
    upload.none(),
    handleAsync(api.auth.signIn)
);

auth.post(
    "/sign-out",
    handleAsync(middleware.hasUserRegistered),
    handleAsync(api.auth.signOut)
);

auth.post(
    "/me",
    handleAsync(middleware.hasUserUnregistered),
    handleAsync(api.auth.me)
);
