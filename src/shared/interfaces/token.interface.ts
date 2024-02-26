import mongoose from "mongoose"

export interface IToken{
    //_id?:string
    userId: string | mongoose.Types.ObjectId
    expires: Date
    fingerprint: string
}