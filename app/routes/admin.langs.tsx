import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IUserDoc, User } from "models/User";

export async function loader({ request, params }: LoaderFunctionArgs) {
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
