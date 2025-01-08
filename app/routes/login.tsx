import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator, requireAuthentication } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
    return [
        { title: "i18n web collab" },
        { name: "description", content: "Translate together!" },
    ];
};

export async function action({ request }: ActionFunctionArgs) {
    // we call the method with the name of the strategy we want to use and the
    // request object, optionally we pass an object with the URLs we want the user
    // to be redirected to after a success or a failure
    return await authenticator.authenticate("user-pass", request, {
        successRedirect: "/",
        failureRedirect: "/login"
    });
};

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export async function loader({ request }: LoaderFunctionArgs) {
    // If the user is already authenticated redirect to /dashboard directly
    return await authenticator.isAuthenticated(request, {
        successRedirect: "/",
    });
};

export default function Screen() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Form method="post" className="join join-vertical space-y-4">
                <h1 className="text-2xl text-center font-bold mb-4">i18n collab</h1>
                <input type="email" name="email" placeholder="Email" className="input input-bordered w-full max-w-xs" autoComplete="email" required />
                <input type="password" name="password" autoComplete="current-password" placeholder="Password" className="input input-bordered w-full max-w-xs" required />
                <button className="btn btn-primary">Sign In</button>
            </Form>
        </div>
    );
}