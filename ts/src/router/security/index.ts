import { Router } from "express";

export const security = Router();

const [{ csrf }] = await Promise.all([import("./csrf.js")]);

security.use("/csrf", csrf);
