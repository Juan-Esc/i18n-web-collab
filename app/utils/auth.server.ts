import { Authenticator } from "remix-auth";
import { IUser, IUserDoc, User } from "models/User";
import { sessionStorage } from "~/utils/session.server";
import { FormStrategy } from "remix-auth-form";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import bcrypt from 'bcrypt'

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<IUserDoc>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
    new FormStrategy(async ({ form }) => {
        let email = form.get("email");
        let password = form.get("password");
        const user = await User.findOne({ email });
        if (!user) return;
        if (!password?.toString()) return

        if (!(await bcrypt.compare(password.toString(), user.password))) return;

        // the type of this user must match the type you pass to the Authenticator
        // the strategy will automatically inherit the type if you instantiate
        // directly inside the `use` method
        return user;
    }),
    // each strategy has a name and can be changed to use another one
    // same strategy multiple times, especially useful for the OAuth2 strategy.
    "user-pass"
);

export const requireAuthentication = async (request : Request) => {
    return await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
}

export const requireAdmin = async (request : Request) => {
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    if (!user) return redirect('/login');
    if (!user.isAdmin) return redirect('/')
    return true;
}

export const createUserAccount = async (email : string, password : string, username : string, isAdmin : boolean = false) => {
    return await User.create({ email, password: await bcrypt.hash(password, 10), username: username, isAdmin: isAdmin });
}