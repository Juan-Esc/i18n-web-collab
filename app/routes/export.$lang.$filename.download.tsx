import { LoaderFunction } from "@remix-run/node";
import { Phrase } from "models/Phrase";

export let loader: LoaderFunction = async ({ request, params }) => {
    let phrases = await Phrase.find({ langCode: params.lang, filename: params.filename });
    let exportObject: any = {}
    phrases.forEach(phrase => {
        exportObject[phrase.key] = phrase.value
    })

    // Create a new Response object with the JSON string as the body and the appropriate headers
    return new Response(JSON.stringify(exportObject), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename=${params.filename}.json`
        }
    });
}