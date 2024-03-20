import mongoose, { Schema, Document } from "mongoose";
import { COOKIE_SETTINGS, REFRESH_TOKEN_EXPIRATION } from "../../constants";
import { IToken } from "../shared/interfaces/token.interface";



interface ITokenDoc extends IToken, Document {}

const tokenSchema = new Schema<ITokenDoc>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    refreshToken: {type: String, required: true},
    expires: {type: Date, required: false, default: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION*1000), index: {expires: 0}}
})
export const TokenModel = mongoose.model<ITokenDoc>('Token', tokenSchema)