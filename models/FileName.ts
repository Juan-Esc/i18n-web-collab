import mongoose, { Schema, model } from 'mongoose';

interface IFileName {
    name : string
}

const fileNameSchema = new Schema({
    name: { type: String, required: true },
});

export interface IFileNameDoc extends IFileName, mongoose.Document { }

export const FileName = mongoose.models.FileName || model<IFileNameDoc>('FileName', fileNameSchema);