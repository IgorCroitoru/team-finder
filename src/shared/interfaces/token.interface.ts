import mongoose from "mongoose"

export interface IToken{
    _id?: any
    userId: string | mongoose.Types.ObjectId
    refreshToken: string
    expires?: Date
    //fingerprint?: string
}