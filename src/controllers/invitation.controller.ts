import { NextFunction, Request, Response } from "express";
import { Errors } from "../exceptions/api.error";
import { InvitationService } from "../services/invitation.service";

export class InvitationController {

    static async validate(req: Request, res: Response, next:NextFunction){
        try
        {
            const token = req.query.token || req.body.token
            if(!token){
                throw Errors.BadRequest
            }
            const inv = await InvitationService.validate(token)
            if(!inv){
                throw Errors.InvalidInvitation
            }
            res.json({success: true})
        }
        catch(e)
        {
            next(e)
        }
    }
}