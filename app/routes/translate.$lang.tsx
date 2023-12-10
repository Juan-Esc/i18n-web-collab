import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { FileName } from "models/FileName";
import { Nav } from "~/components/Nav";
import { authenticator, requireAuthentication } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
    return [
        { title: "i18n web collab" },
        { name: "description", content: "Make translations together" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    await requireAuthentication(request)

    let filenames = await FileName.find();
    return { filenames }
};

export default function TranslateLayout() {
    const data = useLoaderData<typeof loader>();
    
    return (
        <div>
            <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
                {data.filenames.map((filename: any) => {
                    return (
                        <li key={filename.id}>
                            <Link to={`${filename.name}`}>{filename.name}</Link>
                        </li>
                    )
                })}
            </ul>
            <Outlet />
        </div>
    );
}
