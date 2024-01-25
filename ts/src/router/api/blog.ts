import { Router } from "express";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";

export const blog = Router();

const { handleAsync } = util;

blog.get("/all", handleAsync(middleware.hasUserUnregistered));

blog.get("/:blogId", handleAsync(middleware.hasUserUnregistered));

blog.get("/:blogId/likes", handleAsync(middleware.hasUserUnregistered));

blog.get("/:blogId/comments", handleAsync(middleware.hasUserUnregistered));

blog.patch("/:blogId/like", handleAsync(middleware.hasUserRegistered));

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
    handleAsync(middleware.hasUserRegistered),
    handleAsync(middleware.api.blog.isBlogOwner)
);

blog.put(
    "/:blogId/:commentId",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered),
    handleAsync(middleware.api.blog.isCommentOwner)
);

blog.delete(
    "/:blogId",
    handleAsync(middleware.hasUserRegistered),
    handleAsync(middleware.api.blog.isBlogOwner)
);

blog.delete(
    "/:blogId/:commentId",
    handleAsync(middleware.hasUserRegistered),
    handleAsync(middleware.api.blog.isCommentOwner)
);
