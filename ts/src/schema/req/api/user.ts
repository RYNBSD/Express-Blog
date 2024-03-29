import { User } from "../../db.js";
import { definitions } from "../../def.js";

const { Params } = definitions;

export const user = {
    Info: {
        Params: Params.UserId,
    },
    Blogs: {
        Params: Params.UserId
    },
    Update: User.omit({ id: true, picture: true, password: true }),
} as const;
