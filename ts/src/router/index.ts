import { Router } from "express";

export const router = Router();

const [{ api }, { security }] = await Promise.all([import("./api/index.js"), import("./security/index.js")])

router.use("/api", api)
router.use("/security", security)
