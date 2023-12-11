import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { FileName } from "models/FileName";

export async function loader({ request }: LoaderFunctionArgs) {
    let filenames = await FileName.find()
    return { filenames }
};

export default function Export() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <h2 className="text-lg font-bold">Choose file</h2>
            <ul className="menu bg-base-200 w-56 rounded-box">
                {data.filenames.map((filename: any) => (
                    <li><Link to={`${filename.name}`}>{filename.name}</Link></li>
                ))}
            </ul>
            <Outlet />
        </>
    );
}
