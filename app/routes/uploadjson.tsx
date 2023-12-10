import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "i18n web collab" },
        { name: "description", content: "Make translations together" },
    ];
};

export default function UploadJson() {
    return (
        <div>
            <h1>Upload JSON</h1>
            <Form action="/upload" method="post" encType="multipart/form-data">
                <input type="file" className="file-input w-full max-w-xs" />
                <input type="submit" className="btn btn-primary" value="Upload" />
            </Form>
        </div>
    );
}