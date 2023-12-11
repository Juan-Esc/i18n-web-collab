import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { FileName, IFileNameDoc } from "models/FileName";

export async function loader({ request, params }: LoaderFunctionArgs) {
    // If the user is already authenticated redirect to /dashboard directly
    let filenames: IFileNameDoc[] = await FileName.find({}) as IFileNameDoc[]
    return { filenames }
};

export default function Filenames() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold">Files to translate</h2>
            </div>
            <Outlet />
            <table className="table table-zebra mt-6">
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.filenames.map((file: IFileNameDoc) => {
                        return (
                            <tr key={file._id} className="hover">
                                <td>{file.name}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
