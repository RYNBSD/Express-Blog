import { Router } from "express";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { controller } from "../../controller/index.js";

export const blog = Router();

const { handleAsync } = util;
const { api } = controller;

blog.get(
    "/all",
    handleAsync(middleware.hasUserUnregistered),
    handleAsync(api.blog.all)
);

blog.get(
    "/:blogId",
    handleAsync(middleware.hasUserUnregistered),
    handleAsync(api.blog.blog)
);

blog.get(
    "/:blogId/likes",
    handleAsync(middleware.hasUserUnregistered),
    handleAsync(api.blog.blogLikes)
);

blog.get(
    "/:blogId/comments",
    handleAsync(middleware.hasUserUnregistered),
    handleAsync(api.blog.blogComments)
);

blog.patch(
    "/:blogId/like",
    handleAsync(middleware.hasUserRegistered),
    handleAsync(api.blog.like)
);

blog.post(
    "/",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered),
    handleAsync(api.blog.createBlog)
);

blog.post(
    "/:blogId/comment",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered),
    handleAsync(api.blog.createComment)
);

blog.put(
    "/:blogId",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered),
    handleAsync(middleware.api.blog.isBlogOwner),
    handleAsync(api.blog.updateBlog)
);

blog.put(
    "/:blogId/:commentId",
    handleAsync(middleware.security.csrf),
    handleAsync(middleware.hasUserRegistered),
    handleAsync(middleware.api.blog.isCommentOwner),
    handleAsync(api.blog.updateComment)
);

blog.delete(
    "/:blogId",
    handleAsync(middleware.hasUserRegistered),
    handleAsync(middleware.api.blog.isBlogOwner),
    handleAsync(api.blog.deleteBlog)
);

blog.delete(
    "/:blogId/:commentId",
    handleAsync(middleware.hasUserRegistered),
    handleAsync(middleware.api.blog.isCommentOwner),
    handleAsync(api.blog.deleteComment)
);
