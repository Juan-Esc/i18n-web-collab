import { redirect, type LoaderFunctionArgs, type MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { AlertPhrase, IAlertPhraseDoc } from "models/AlertPhrase";
import { HistoryPhrase, IHistoryPhraseDoc } from "models/HistoryPhrase";
import { IPhraseDoc, Phrase } from "models/Phrase";
import { Nav } from "~/components/Nav";
import { authenticator, requireAuthentication } from "~/utils/auth.server";
import { showDateAndHour } from "~/utils/date";

export const meta: MetaFunction = () => {
    return [
        { title: "i18n web collab" },
        { name: "description", content: "Make translations together" },
    ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
    const user = await requireAuthentication(request)

    const phrase = await Phrase.findOne({ _id: params.id })
    const historyPhrases = await HistoryPhrase.find({ phraseId: params.id }).sort({ date: -1 }).limit(20)
    const alertPhrase = await AlertPhrase.findOne({ phraseId: params.id, userId: user._id })

    return { phrase, historyPhrases, alertPhrase }
};

export async function action({ request }: ActionFunctionArgs) {
    // we call the method with the name of the strategy we want to use and the
    // request object, optionally we pass an object with the URLs we want the user
    // to be redirected to after a success or a failure
    const user = await requireAuthentication(request);
    const body = await request.formData();

    if (body.get('reason') == 'Update') {
        const id = body.get('id')
        const value = body.get('value')

        if (!id || !value) return "Error"

        const phrase = await Phrase.findOne({ _id: id })
        if (phrase.value == value) return redirect(`/translate/phrase/${id}`)

        const phraseUpdated = await Phrase.updateOne({ _id: id }, { value: value })

        const historyPhrase = await HistoryPhrase.create({
            phraseId: id,
            value: value,
            date: new Date(),
            userId: user._id,
            username: user.username,
            etype: 2
        })

        return redirect(`/translate/phrase/${id}`);
    } else if (body.get('reason') == 'Send') {
        const id = body.get('id')
        const message = body.get('message')

        if (!id || !message) return "Error"
        const phrase = await Phrase.findOne({ _id: id })
        let alertPhrase: IAlertPhraseDoc | null = await AlertPhrase.findOne({ phraseId: id, userId: user._id })

        if (alertPhrase) {

            alertPhrase = await alertPhrase.updateOne({
                date: new Date(),
                reason: message,
                phraseValue: phrase.value,
                langCode: phrase.langCode
            })
        } else {
            alertPhrase = await AlertPhrase.create({
                phraseId: id,
                reason: message,
                date: new Date(),
                username: user.username,
                userId: user._id,
                phraseValue: phrase.value,
                langCode: phrase.langCode
            })
        }

        return redirect(`/translate/phrase/${id}`);
    }

};

export default function TranslateLayout() {
    const data = useLoaderData<typeof loader>();
    if (!data?.phrase) return 'Error';
    const phrase: IPhraseDoc = data.phrase;
    const navigate = useNavigate()
    
    return (
        <div>
            <button onClick={() => navigate(-1)} className="btn btn-square bg-transparent w-6">
                <svg className="svg-icon fill-white" viewBox="0 0 20 20">
                    <path d="M3.24,7.51c-0.146,0.142-0.146,0.381,0,0.523l5.199,5.193c0.234,0.238,0.633,0.064,0.633-0.262v-2.634c0.105-0.007,0.212-0.011,0.321-0.011c2.373,0,4.302,1.91,4.302,4.258c0,0.957-0.33,1.809-1.008,2.602c-0.259,0.307,0.084,0.762,0.451,0.572c2.336-1.195,3.73-3.408,3.73-5.924c0-3.741-3.103-6.783-6.916-6.783c-0.307,0-0.615,0.028-0.881,0.063V2.575c0-0.327-0.398-0.5-0.633-0.261L3.24,7.51 M4.027,7.771l4.301-4.3v2.073c0,0.232,0.21,0.409,0.441,0.366c0.298-0.056,0.746-0.123,1.184-0.123c3.402,0,6.172,2.709,6.172,6.041c0,1.695-0.718,3.24-1.979,4.352c0.193-0.51,0.293-1.045,0.293-1.602c0-2.76-2.266-5-5.046-5c-0.256,0-0.528,0.018-0.747,0.05C8.465,9.653,8.328,9.81,8.328,9.995v2.074L4.027,7.771z"></path>
                </svg>
            </button>
            <AlertDevsModal phrase={phrase} alertPhrase={data?.alertPhrase} />
            <Form method="post" className="flex flex-col mx-28 space-y-4">
                <h2 className="text-2xl text-center font-bold mb-4">Edit translation</h2>
                <div className="flex flex-col space-y-2">

                    {phrase.variableTags?.length > 0 && (
                        <div className="join">
                            <h4 className="text-lg mr-2">Variables</h4>
                            {phrase.variableTags.map(variable => (
                                <div className="badge badge-secondary mt-1 mr-2">{variable}</div>
                            ))}
                        </div>
                    )}

                    <input type="hidden" name="id" value={phrase._id} />
                    <input type="text" name="key" className="input input-bordered" readOnly value={phrase.key} />
                    <input type="text" name="value" placeholder="Translation" className="input input-bordered" defaultValue={phrase.value} required />
                    <input type="submit" name="reason" className="btn btn-primary" value="Update" />
                </div>
            </Form>

            <div className="mt-5">
                <h2 className="text-2xl text-center font-bold mb-4">Last changes</h2>

                <ul className="timeline timeline-vertical">
                    {data.historyPhrases.map((historyPhrase, index) => (
                        <li key={index}>
                            <div className="timeline-start">{showDateAndHour(historyPhrase.date)}</div>
                            <div className="timeline-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                            </div>
                            <div className="timeline-end timeline-box">
                                {historyPhrase.etype == 0 && (
                                    historyPhrase.username + " imported this phrase"
                                )}
                                {historyPhrase.etype == 1 && (
                                    historyPhrase.username + " created this phrase"
                                )}
                                {historyPhrase.etype == 2 && (
                                    <span>{historyPhrase.username} updated phrase <ReadOldPhraseModal key={historyPhrase._id.toString()} historyPhrase={historyPhrase} oldHistoryPhrase={data.historyPhrases[index+1]} /></span>
                                )}
                            </div>
                            <hr />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

interface AlertDevsModalProps {
    phrase: IPhraseDoc
    alertPhrase?: IAlertPhraseDoc
}

export const AlertDevsModal = ({ phrase, alertPhrase }: AlertDevsModalProps) => {
    return (
        <>
            <button className="btn float-right" onClick={() => document.getElementById('my_modal_3').showModal()}>🔔 Notify devs</button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <Form method="POST" onSubmit={() => document.getElementById('my_modal_3').close()} >
                        <h3 className="font-bold text-lg">Report a problem with this phrase</h3>
                        <p className="py-4">What makes it difficult or impossible to translate this sentence?</p>

                        <input type="hidden" name="id" value={phrase._id} />
                        {alertPhrase && (
                            <textarea className="textarea textarea-bordered w-full" placeholder="Tell us the problem 🤗" rows={4} name="message" defaultValue={alertPhrase.reason}  ></textarea>
                        )}
                        {!alertPhrase && (
                            <textarea className="textarea textarea-bordered w-full" placeholder="Tell us the problem 🤗" rows={4} name="message"></textarea>
                        )}
                        <input type="submit" name="reason" className="btn btn-primary w-full my-4" value="Send" />
                    </Form>
                </div>
            </dialog>
        </>
    )
}

interface ReadOldPhraseModalProps {
    historyPhrase: IHistoryPhraseDoc
    oldHistoryPhrase: IHistoryPhraseDoc
}

export const ReadOldPhraseModal = ({ historyPhrase, oldHistoryPhrase } : ReadOldPhraseModalProps) => {
    return (
        <>
            <button className="btn" onClick={() => document.getElementById('readmodal' + historyPhrase._id).showModal()}>open modal</button>
            <dialog id={'readmodal' + historyPhrase._id} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg my-5">{historyPhrase.username} updated translation</h3>
                    <fieldset disabled={true} className="space-y-2">
                    <p className="text-lg">Old value:</p>
                    <textarea className="textarea textarea-bordered w-full resize-none line-through" rows={2} name="phraseValue" defaultValue={oldHistoryPhrase?.value}  ></textarea>
                    <p className="text-lg">New value:</p>
                    <textarea className="textarea textarea-bordered w-full resize-none" rows={2} name="phraseValue" defaultValue={historyPhrase.value}  ></textarea>
                    </fieldset>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}