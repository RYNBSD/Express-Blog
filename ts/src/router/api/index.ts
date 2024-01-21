import { Router } from "express";

export const api = Router();

const [{ auth }, { user }, { blog }] = await Promise.all([
    import("./auth.js"),
    import("./user.js"),
    import("./blog.js"),
]);

api.use("/auth", auth);
api.use("/user", user);
api.use("/blog", blog);
