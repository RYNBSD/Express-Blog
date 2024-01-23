import { Router } from "express";

export const user = Router();

user.get("/:userId/info");

user.get("/:userId/blogs");

user.put("/:userId");

user.delete("/:userId");
