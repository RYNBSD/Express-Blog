import { Router } from "express";

export const router = Router();

const [{ auth }, { user }, { blog }] = await Promise.all([
    import("./auth.js"),
    import("./user.js"),
    import("./blog.js"),
]);

router.use("/auth", auth);
router.use("/user", user);
router.use("/blog", blog);
