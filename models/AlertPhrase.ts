import mongoose, { ObjectId, Schema, model } from 'mongoose';

interface IAlertPhrase {
    phraseId : ObjectId;
    reason : string;
    date : Date;
    username : string;
    userId : ObjectId;
    phraseValue : string;
    langCode : string;
}

const alertPhraseSchema = new Schema({
    phraseId: { type: mongoose.ObjectId, required: true },
    reason: { type: String, required: true },
    date: { type: Date, required: true },
    username: { type: String, required: true },
    userId: { type: mongoose.ObjectId, required: true },
    phraseValue: { type: String, required: true },
    langCode: { type: String, required: true },
});

export interface IAlertPhraseDoc extends IAlertPhrase, mongoose.Document { }

export const AlertPhrase = mongoose.models.AlertPhrase || model<IAlertPhraseDoc>('AlertPhrase', alertPhraseSchema);
