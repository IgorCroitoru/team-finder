import { InvitationModel } from "../models/invite.model";
import { generateInvitationToken } from "../shared/utils";
import {IInvitation} from "../shared/interfaces/invite.interface"
import jwt from 'jsonwebtoken'
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
    static isValidInvitationToken(token: string): boolean{
        try{
            const user = jwt.verify(token, String(process.env.JWT_SIGNUP_SECRET))
            if(user) return true
            return false
        }
        catch(e){
            return false
        }
     }
}