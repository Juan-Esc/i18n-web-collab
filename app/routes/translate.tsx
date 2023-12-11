import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Nav } from "~/components/Nav";
import { requireAuthentication } from "~/utils/auth.server";
import { languages } from 'config.json';

export const meta: MetaFunction = () => {
    return [
        { title: "i18n web collab" },
        { name: "description", content: "Make translations together" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    return await requireAuthentication(request)
};

export default function TranslateLayout() {
    const data = useLoaderData<typeof loader>();
    return (
        <div>
            <Nav />
            <div className="flex h-screen flex-col md:flex-row">
                <div className="p-4 space-y-4 md:overflow-hidden shadow sm:w-64 md:h-full">
                    <ul className="menu bg-base-200 w-56 rounded-box">
                        {Object.keys(languages).map((lang) => {
                            return (
                                <li key={lang}>
                                    <Link to={`/translate/${lang}`}>{languages[lang]}</Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="flex flex-col flex-1 p-6 rounded-r-lg">
                    <Outlet />
                </div>
            </div>
        </div>

    );
}
