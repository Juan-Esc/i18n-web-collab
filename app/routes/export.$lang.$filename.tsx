import { useParams } from "@remix-run/react";

export default function Export() {
    const params = useParams();

    return (
        <>
            <a className="btn btn-primary" href={`/export/${params.lang}/${params.filename}/download`}>Download</a>
        </>
    );
}
