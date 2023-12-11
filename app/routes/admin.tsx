import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { Nav } from "~/components/Nav";
import { authenticator, requireAdmin, requireAuthentication } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
    return [
        { title: "i18n web collab" },
        { name: "description", content: "Make translations together" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    return requireAdmin(request)
};

export default function TranslateLayout() {
    return (
        <div>
            <Nav isAdmin={true} />
            <div className="flex h-screen flex-col md:flex-row">
                <div className="p-4 space-y-4 overflow-hidden shadow sm:w-64 md:h-full">
                    <ul className="menu bg-base-200 w-56 rounded-box">
                        <li><Link to={'/admin/users'}>Users</Link></li>
                        <li><Link to={'/admin/files'}>Files to translate</Link></li>
                        <li><Link to={'/admin/langs'}>Languages</Link></li>
                        <li><Link to={'/admin/alerts'}>Dev Alerts</Link></li>
                    </ul>
                </div>
                <div className="flex flex-col flex-1 p-6 rounded-r-lg">
                    <Outlet />
                </div>
            </div>
        </div>

    );
}
