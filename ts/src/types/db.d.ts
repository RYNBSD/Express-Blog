import type {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import type { z } from "zod";
import type { schema } from "../schema/index.js";

type CreateOptionalIdString = { id: CreationOptional<string> };
type CreateOptionalIdNumber = { id: CreationOptional<number> };

type User = z.infer<typeof schema.db.User> & CreateOptionalIdString;
type Blog = z.infer<typeof schema.db.Blog> & CreateOptionalIdString;
type BlogImages = z.infer<typeof schema.db.BlogImages> & CreateOptionalIdNumber;
type BlogLikes = z.infer<typeof schema.db.BlogLikes> & CreateOptionalIdNumber;
type BlogComments = z.infer<typeof schema.db.BlogComments> &
    CreateOptionalIdNumber;
type Error = z.infer<typeof schema.db.Error> &
    CreateOptionalIdNumber & { isFixed: CreationOptional<boolean> };

export type Tables = {
    User: Model<InferAttributes<User>, InferCreationAttributes<User>>;
    Blog: Model<InferAttributes<Blog>, InferCreationAttributes<Blog>>;
    BlogImages: Model<
        InferAttributes<BlogImages>,
        InferCreationAttributes<BlogImages>
    >;
    BlogLikes: Model<
        InferAttributes<BlogLikes>,
        InferCreationAttributes<BlogLikes>
    >;
    BlogComments: Model<
        InferAttributes<BlogComments>,
        InferCreationAttributes<BlogComments>
    >;
    Error: Model<InferAttributes<Error>, InferCreationAttributes<Error>>;
};
