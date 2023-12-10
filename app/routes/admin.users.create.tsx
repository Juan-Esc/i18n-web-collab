import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createUserAccount } from "~/utils/auth.server";

export async function action({ request }: ActionFunctionArgs) {
    // we call the method with the name of the strategy we want to use and the
    // request object, optionally we pass an object with the URLs we want the user
    // to be redirected to after a success or a failure
    const body = await request.formData();
    const email = body.get("email")?.toString();
    const password = body.get("password")?.toString();
    const username = body.get("username")?.toString();
    const isAdmin = body.get("isAdmin")?.toString() == "true";
    if (!email || !password || !username) return redirect("/admin/users/create");

    await createUserAccount(email, password, username, isAdmin)

    return redirect("/admin/users");
};


export default function CreateUser() {
    return (
        <Form method="post" className="join join-vertical space-y-4">
            <input type="email" name="email" placeholder="Email" className="input input-bordered w-full max-w-xs" autoComplete="email" required />
            <input type="password" name="password" autoComplete="current-password" placeholder="Password" className="input input-bordered w-full max-w-xs" required />
            <input type="text" name="username" placeholder="Username" className="input input-bordered w-full max-w-xs" autoComplete="username" required />
            <select className="select w-full max-w-xs" name="isAdmin" defaultValue={"false"}>
                <option value="false">No admin</option>
                <option value="true">Admin</option>
            </select>
            <button className="btn btn-primary">Create user</button>
        </Form>
    )
}