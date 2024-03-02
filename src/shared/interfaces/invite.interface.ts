import mongoose from 'mongoose'
export interface IInvitation{
    _id?: any
    inviterId: string | mongoose.Schema.Types.ObjectId
    organizationId: string | mongoose.Schema.Types.ObjectId
    expiresAt: Date
    token: string
}