import { InvitationModel } from "../models/invite.model";
import { generateInvitationToken } from "../shared/utils";
import {IInvitation} from "../shared/interfaces/invite.interface"

export class InvitationService {
    static async create(inviterId:any, organizationId: any ){
        const token = generateInvitationToken(inviterId, organizationId)
        const inv: IInvitation = {
            inviterId,
            organizationId,
            expiresAt: token.expiration,
            token: token.token
        }
        await InvitationModel.create(inv)
        return token
    }
}