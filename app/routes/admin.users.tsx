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
            <div className="flex justify-between">
                <h2 className="text-lg font-bold">Users</h2>
                <Link to={'/admin/users/create'} className="btn btn-primary max-w-sm ">Create user</Link>
            </div>
            <Outlet />
            <table className="table table-zebra mt-6">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>isAdmin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.users.map((user: IUserDoc) => {
                        return (
                            <tr key={user._id} className="hover">
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
