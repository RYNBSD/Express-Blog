import { z } from "zod"

const IdUUID = z.object({
    id: z.string().trim().uuid()
}).strict()

const IdInt = z.object({
    id: z.number().min(1)
}).strict()

export const User = z.object({
    username: z.string().trim().max(50),
    email: z.string().trim().max(50),
    password: z.string().trim().max(70),
    picture: z.string().trim().max(70)
}).merge(IdUUID).strict()

export const Blog = z.object({
    title: z.string().trim().max(255),
    description: z.string().trim().max(1000),
    bloggerId: z.string().trim().uuid(),
}).merge(IdUUID).strict()

export const BlogImages = z.object({
    image: z.string().trim().max(70),
    blogId: z.string().trim().uuid()
}).merge(IdInt).strict()

export const BlogLikes = z.object({
    blogId: z.string().trim().uuid(),
    likerId: z.string().trim().uuid(),
}).merge(IdInt).strict()

export const BlogComments = z.object({
    comment: z.string().trim().max(255),
    blogId: z.string().trim().uuid(),
    commenterId: z.string().trim().uuid()
}).merge(IdInt).strict()

export const Error = z.object({
    status: z.number().min(100).max(599),
    message: z.string().trim().max(255),
    isFixed: z.boolean()
}).merge(IdInt).strict()