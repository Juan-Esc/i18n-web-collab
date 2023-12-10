import mongoose, { ObjectId, Schema, model } from 'mongoose';

interface IHistoryPhrase {
    phraseId : ObjectId;
    value : string;
    date : Date;
    username : string;
    userId : ObjectId;
    etype: number;
}

const historyPhraseSchema = new Schema({
    phraseId: { type: mongoose.ObjectId, required: true, index: true },
    value: { type: String, required: true },
    date: { type: Date, required: true },
    username: { type: String, required: true },
    userId: { type: mongoose.ObjectId, required: true },
    etype: { type: Number, required: true }, // 0: imported, 1: created, 2: updated
});


export interface IHistoryPhraseDoc extends IHistoryPhrase, mongoose.Document { }

export const HistoryPhrase = mongoose.models.HistoryPhrase || model<IHistoryPhraseDoc>('HistoryPhrase', historyPhraseSchema);
