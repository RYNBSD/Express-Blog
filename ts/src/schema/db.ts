import { z } from "zod"

const IdUUID = z.object({
    id: z.string().trim().uuid()
}).strict()
const IdInt = z.object({
    id: z.number().min(1)
}).strict()

export const User = z.object({
    username: z.string(),
}).strict()