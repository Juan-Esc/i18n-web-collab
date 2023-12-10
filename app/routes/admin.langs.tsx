import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { IUserDoc, User } from "models/User";

export async function loader({ request, params }: LoaderFunctionArgs) {
    // If the user is already authenticated redirect to /dashboard directly
    let users: IUserDoc[] = await User.find({}) as IUserDoc[]
    return { users }
};

export default function Users() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="overflow-x-auto">
            <h2>You can configure languages in config.json</h2>
        </div>
    );
}
