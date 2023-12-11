import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { User } from "models/User";
import { authenticator, createUserAccount, requireAuthentication } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Create | i18n web collab" },
        { name: "description", content: "Make translations together" },
    ];
};

export async function action({ request }: ActionFunctionArgs) {
    const body = await request.formData();
    const email = body.get("email")?.toString();
    const password = body.get("password")?.toString();
    const username = body.get("username")?.toString();
    if (!email || !password || !username) return redirect("/login");

    await createUserAccount(email, password, username, true)

    return await authenticator.authenticate("user-pass", request, {
        successRedirect: "/",
        failureRedirect: "/login"
    });
};

export async function loader({ request }: LoaderFunctionArgs) {
    const userCount = await User.countDocuments();

    if (userCount > 0) return redirect("/");
    return {}
};

export default function Screen() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Form method="post" className="join join-vertical space-y-4">
                <h1 className="text-2xl text-center font-bold mb-4">i18n collab | Create admin account</h1>
                <input type="email" name="email" placeholder="Email" className="input input-bordered w-full max-w-xs" autoComplete="email" required />
                <input type="password" name="password" autoComplete="current-password" placeholder="Password" className="input input-bordered w-full max-w-xs" required />
                <input type="text" name="username" placeholder="Username" className="input input-bordered w-full max-w-xs" autoComplete="username" required />
                <button className="btn btn-primary">Create account</button>
            </Form>
        </div>
    );
}