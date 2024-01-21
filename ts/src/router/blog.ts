import { Router } from "express";

export const blog = Router()

blog.get("/all")

blog.get("/:blogId")

blog.get("/:blogId/likes")

blog.get("/:blogId/comments")

blog.patch("/like")

blog.post("/")

blog.put("/:blogId")

blog.delete("/:blogId")