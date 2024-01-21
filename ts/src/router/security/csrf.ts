import { Router } from "express";
import { util } from "../../util/index.js";
import { controller } from "../../controller/index.js";

export const csrf = Router();
const { handleAsync } = util;
const { security } = controller

csrf.get("/token", handleAsync(security.csrf.create));
csrf.delete("/token", handleAsync(security.csrf.delete));