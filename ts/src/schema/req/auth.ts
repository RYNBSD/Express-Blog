import { User } from "../db.js";

export const auth = {
    SignUp: User.omit({ id: true, picture: true }),
    SignIn: User.omit({ id: true, username: true, picture: true }),
} as const;
