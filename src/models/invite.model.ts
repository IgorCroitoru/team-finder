import mongoose, {Schema, Document} from 'mongoose'
import { IInvitation } from '../shared/interfaces/invite.interface'

interface IInvitationDoc extends IInvitation, Document {}
const invitationSchema = new Schema<IInvitationDoc>({
    inviterId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    token: {type: String, required: true},
    expiresAt: {type: Date, required: true},
    organizationId: {type: Schema.Types.ObjectId, ref: 'Organization', required: true}
}, {timestamps: true})

export const InvitationModel = mongoose.model<IInvitationDoc>('Invitation', invitationSchema)