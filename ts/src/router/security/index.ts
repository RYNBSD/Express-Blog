import { Router } from "express";

export const security = Router();

const [{ csrf }, { access }] = await Promise.all([
    import("./csrf.js"),
    import("./access.js"),
]);

security.use("/csrf", csrf);
security.use("/access", access);
