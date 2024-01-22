import { Router } from "express";
import { util } from "../../util/index.js";
import { config } from "../../config/index.js";
import { controller } from "../../controller/index.js";

export const auth = Router();

const { handleAsync } = util;
const { upload } = config
const { api } = controller

auth.post("/sign-up", upload.single("picture"), handleAsync(api.auth.signUp));

auth.post("/sign-in", handleAsync(api.auth.signIn));

auth.post("/sign-out", handleAsync(api.auth.signOut));

auth.post("/me", handleAsync(api.auth.me));
