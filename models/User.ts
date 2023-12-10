import mongoose, { Schema, model } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    isAdmin: boolean;
    username: string;
}

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    username: { type: String, required: true },
});

export interface IUserDoc extends IUser, mongoose.Document { }

export const User = mongoose.models.User || model<IUserDoc>('User', userSchema);