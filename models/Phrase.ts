import mongoose, { Schema, model } from 'mongoose';

interface IPhrase {
    key: string;
    value: string;
    langCode: string;
    filename: string;
    variableTags: string[];
}

const phraseSchema = new Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
    langCode: { type: String, required: true, index: true },
    filename: { type: String, required: true, index: true },
    variableTags: { type: [String] },
});


export interface IPhraseDoc extends IPhrase, mongoose.Document { }

export const Phrase = mongoose.models.Phrase || model<IPhraseDoc>('Phrase', phraseSchema);
