import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { FileName } from "models/FileName";
import { Phrase } from "models/Phrase";
import { Nav } from "~/components/Nav";
import { requireAuthentication } from "~/utils/auth.server";

export default function Export() {
    const params = useParams();

    return (
        <>
        <a className="btn btn-primary" href={`/export/${params.lang}/${params.filename}/download`}>Download</a>
        </>
    );
}
