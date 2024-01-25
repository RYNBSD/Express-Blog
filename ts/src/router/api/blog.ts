import { Router } from "express";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";

export const blog = Router();

const { handleAsync } = util;

blog.get("/all", handleAsync(middleware.hasUserUnregistered));

blog.get("/:blogId", handleAsync(middleware.hasUserUnregistered));

blog.get("/:blogId/likes", handleAsync(middleware.hasUserUnregistered));

blog.get("/:blogId/comments", handleAsync(middleware.hasUserUnregistered));

blog.patch("/like", handleAsync(middleware.hasUserUnregistered));

blog.post(
    "/",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered)
);

blog.post(
    "/:blogId/comment",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered)
);

blog.put(
    "/:blogId",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered)
);

blog.put(
    "/:blogId/:commentId",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered)
);

blog.delete("/:blogId", handleAsync(middleware.hasUserRegistered));
