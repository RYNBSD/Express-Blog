import { Router } from "express";

export const auth = Router()

auth.post("/sign-up")

auth.post("/sign-in")

auth.post("/me")

auth.post("/forgot-password")
