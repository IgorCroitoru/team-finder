import { InvitationModel } from "../models/invite.model";
import { generateInvitationToken } from "../shared/utils";
import {IInvitation} from "../shared/interfaces/invite.interface"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { json } from "stream/consumers";
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
            const inv = jwt.verify(token, String(process.env.JWT_SIGNUP_SECRET))
            if(inv) return true
            return false
        }
        catch(e){
            return false
        }
     }
    static async validate(token: string){
        try{
            const inv = jwt.verify(token, String(process.env.JWT_SIGNUP_SECRET)) as JwtPayload
            const invDb = await InvitationModel.findOne({token: token}).exec()
            if(inv&&invDb){
                return true
            }
            return false
        }
        catch(e){
            return false
        }
    }
}