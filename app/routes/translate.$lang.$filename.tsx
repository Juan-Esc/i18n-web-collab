import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { IPhraseDoc, Phrase } from "models/Phrase";
import { Nav } from "~/components/Nav";
import { authenticator, requireAuthentication } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
    return [
        { title: "i18n web collab" },
        { name: "description", content: "Make translations together" },
    ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
    // If the user is already authenticated redirect to /dashboard directly
    await requireAuthentication(request)

    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const key = url.searchParams.get("key");
    const skip = page ? parseInt(page) * 20 : 0;

    if (key) {
        let phrases: IPhraseDoc[] = await Phrase.find({ 
            langCode: params.lang, 
            // filename: params.filename, 
            key: { $regex: new RegExp(key, 'i') } 
        }).skip(skip).limit(20);
        return { phrases }
    }

    let phrases: IPhraseDoc[] = await Phrase.find({ langCode: params.lang, filename: params.filename }).skip(skip).limit(20);
    return { phrases }
};

export default function TranslateLayout() {
    const data = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams()
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 0
    const phrases: IPhraseDoc[] = data.phrases as IPhraseDoc[]
    return (
        <div className="overflow-x-auto">

            <Form method="get">
                <div className="join flex justify-end">
                    <div>
                        <div>
                            <input className="input input-bordered join-item" name="key" placeholder="Search" />
                        </div>
                    </div>
                    <div className="indicator">
                        <button className="btn join-item">Search</button>
                    </div>
                </div>
            </Form>

            <table className="table table-zebra mt-6">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {phrases.map((phrase: IPhraseDoc) => {
                        return (
                            <tr key={phrase._id} className="hover">
                                <td>{phrase.key}</td>
                                <td>{phrase.value}</td>
                                <td><Link to={'../../phrase/' + phrase._id} className="btn btn-primary">Edit</Link></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="join my-5 flex justify-center">
                {page != 0 && (<Link to={`?page=${page - 1}`} className="join-item btn">«</Link>)}
                <button className="join-item btn">Page {page}</button>
                <Link to={`?page=${page + 1}`} className="join-item btn">»</Link>
            </div>
        </div>
    );
}
