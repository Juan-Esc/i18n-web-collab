import { unstable_parseMultipartFormData, type LoaderFunctionArgs, type MetaFunction, ActionFunctionArgs, unstable_createMemoryUploadHandler, json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { User } from "models/User";
import { Nav } from "~/components/Nav";
import { authenticator, requireAuthentication } from "~/utils/auth.server";
import { readFile } from 'fs';
import { promisify } from 'util';
import { useState } from "react";
import { Phrase } from "models/Phrase";
import { FileName } from "models/FileName";
import { HistoryPhrase } from "models/HistoryPhrase";

export const meta: MetaFunction = () => {
    return [
        { title: "i18n web collab" },
        { name: "description", content: "Make translations together" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    // If the user is already authenticated redirect to /dashboard directly
    let user: any = await requireAuthentication(request)
    return { isAdmin: user.isAdmin }
};

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    const body = await request.formData();
    const jsonImported = body.get("jsonImported")?.toString();
    const fileName = body.get("fileName")?.toString();
    const lang = body.get("lang")?.toString();
    const user = await requireAuthentication(request);

    if (!jsonImported) return;

    const parsedJson = JSON.parse(jsonImported);

    let fileNameModel = await FileName.findOne({ name: fileName });
    if (!fileNameModel) {
        fileNameModel = await FileName.create({ name: fileName });
    }

    for (const key in parsedJson) {
        let phrase = await Phrase.findOne({ key: key, langCode: lang, filename: fileName });

        if (!phrase) {
            let value = key;

            let matches = value.match(/\{\{(.+?)\}\}/g); // find variables in the string, e.g. {{name}}
            let variables : string[] = [];

            if (matches) {
                variables = matches.map(match => match.replace(/\{\{|\}\}/g, ''));
                variables = variables.map(match => match.replace(/ /g, ''));
            }
            
            const phrase = await Phrase.create({
                key: key,
                langCode: lang,
                value: parsedJson[key],
                filename: fileName,
                variableTags: variables
            })

            const historyPhrase = await HistoryPhrase.create({
                phraseId: phrase._id,
                value: phrase.value,
                date: new Date(),
                userId: user._id,
                username: user.username,
                etype: 0
            })
        }
    }
    // to-do: delete translations on database that did not appear on the imported json

    return redirect(`/translate/${lang}/${fileName}`);
}

export default function Import() {
    const data = useLoaderData<typeof loader>();

    const [fileContent, setFileContent] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    const navigation = useNavigation();
    const isSubmitting = navigation.formAction === "/import";

    return (
        <div>
            <Nav />
            <div className="hero min-h-screen bg-base-200">
                {data.isAdmin && (
                    <div>
                        <input type="file" name="jsonFile" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChange} />
                        {fileContent && (<>
                            <Form method="post">
                                <fieldset disabled={isSubmitting}>
                                    <div className="join join-vertical">
                                        <input type="text" name="fileName" placeholder="File name" className="input input-bordered w-full max-w-xs join-item" />
                                        <input type="text" name="lang" placeholder="Language" className="input input-bordered w-full max-w-xs join-item" />
                                        <textarea name="jsonImported" className="w-full h-64 join-item" readOnly value={fileContent} />
                                        <input type="submit" className="btn btn-primary join-item" value="Upload" />
                                    </div>
                                </fieldset>
                                {isSubmitting ? <span className="loading loading-dots loading-lg"></span> : null}
                            </Form>
                        </>)}
                    </div>
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
