import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { AlertPhrase, IAlertPhraseDoc } from "models/AlertPhrase";

export async function loader({ request, params }: LoaderFunctionArgs) {
    let alertPhrases = await AlertPhrase.find({}) as IAlertPhraseDoc[]
    return { alertPhrases }
};

export default function Alerts() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold">Phrases needing developers help</h2>
            </div>
            <Outlet />
            <table className="table table-zebra mt-6">
                <thead>
                    <tr>
                        <th>Phrase ID</th>
                        <th>Language</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.alertPhrases.map((alert: IAlertPhraseDoc) => {
                        return (
                            <tr key={alert._id} className="hover">
                                <td>{alert.phraseId}</td>
                                <td>{alert.langCode}</td>
                                <td><AlertDevsReadModal alertPhrase={alert} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

interface AlertDevsReadModalProps {
    alertPhrase: IAlertPhraseDoc
}

export const AlertDevsReadModal = ({ alertPhrase }: AlertDevsReadModalProps) => {
    return (
        <>
            <button className="btn" onClick={() => (document.getElementById('my_modal_3') as any).showModal()}>Read report</button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <fieldset disabled={true} className="space-y-5">
                        <p className="text-lg">ID:</p>
                        <input type="text" defaultValue={alertPhrase.phraseId} className="input input-bordered w-full" />
                        <p className="text-lg">Original phrase key:</p>
                        <textarea className="textarea textarea-bordered w-full resize-none" rows={4} name="phraseValue" defaultValue={alertPhrase.phraseValue}  ></textarea>
                        <p className="text-lg">Reason:</p>
                        <textarea className="textarea textarea-bordered w-full resize-none" rows={4} name="message" defaultValue={alertPhrase.reason}  ></textarea>
                        
                    </fieldset>
                    <Link to={`/translate/phrase/${alertPhrase.phraseId}`} className="btn btn-primary max-w-xs my-3">Go to translate phrase</Link>
                </div>
            </dialog>
        </>
    )
}
