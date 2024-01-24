import { User } from "../../db.js";

export const auth = {
    SignUp: User.omit({ id: true, picture: true }),
    SignIn: User.omit({ id: true, username: true, picture: true }),
    ForgotPassword: User.omit({
        id: true,
        username: true,
        email: true,
        picture: true,
    }),
} as const;
