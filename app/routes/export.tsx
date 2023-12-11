import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Nav } from "~/components/Nav";
import { requireAuthentication } from "~/utils/auth.server";
import { languages } from 'config.json';

export async function loader({ request }: LoaderFunctionArgs) {
    let user: any = await requireAuthentication(request)
    return { isAdmin: user.isAdmin }
};

export default function Export() {
    const data = useLoaderData<typeof loader>();

    return (
        <div>
            <Nav />
            <div className="hero min-h-screen bg-base-200">
                {data.isAdmin && (
                    <>
                        <div className="p-4 space-y-4 overflow-hidden shadow sm:w-64 h-full">
                            <h2 className="text-lg font-bold">Choose language</h2>
                            <ul className="menu bg-base-200 w-56 rounded-box">
                                {Object.keys(languages).map((lang) => {
                                    return (
                                        <li key={lang}>
                                            <Link to={`/export/${lang}`}>{languages[lang]}</Link>
                                        </li>
                                    )
                                })}
                            </ul>
                            <Outlet />
                        </div>
                    </>
                )}
                {!data.isAdmin && (
                    <div className="card w-96 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">You must be an admin to do this!</h2>
                            <p>Contact an admin if you think this is an error</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
