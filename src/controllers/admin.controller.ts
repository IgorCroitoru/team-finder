import e, { NextFunction, Request, Response } from 'express';
import { COOKIE_SETTINGS } from '../../constants';
import { TokenService } from '../services/token.service';
import { IUser } from '../shared/interfaces/user.interface';
import {AuthService} from '../services/auth.service';
import { RoleType } from '../shared/enums';
import mongoose from 'mongoose';
import { UserModel } from '../models/user.model';
import { IOrganization } from '../shared/interfaces/organization.interface';
import { Organization } from '../models/org.model';
import { Errors } from '../exceptions/api.error';
import { InvitationService } from '../services/invitation.service';
import { UserDto } from '../shared/dtos/user.dto';
import { AdminService } from '../services/admin.service';
import { resolveRole } from '../shared/utils';
export class AdminController{

    static async setRole(req: Request, res: Response, next:NextFunction)
    {
        try {
            const roleUpdate = req.body
            const {userId, role} = roleUpdate
            const resolvedRole = resolveRole(role)
            if(userId&&resolvedRole)
            {
                const updatedUser = await AdminService.setRole(userId, resolvedRole)
                return res.json({success: true, user: updatedUser})
            }
            throw Errors.BadRequest
        } catch (error) {
            next(error)
        }
    }
    static async deleteRole(req: Request, res: Response, next:NextFunction){
        try {
            const request = req.body;
            const {userId, role} = request
            const resolvedRole = resolveRole(role)
            if(!resolvedRole){
                throw Errors.BadRequest
            }
            const user = await AdminService.deleteRole(userId, resolvedRole)
            return res.json({success:true, user})
            
        } catch (error) {
            next(error)
        }
    }

    
    static async generateInvitation(req: Request, res: Response, next:NextFunction){
        try{
            
            let accessToken;
            let inviteToken;
            if (req.headers.authorization){
                accessToken = req.headers.authorization.split(' ')[1];
            }
           
            else{
                throw Errors.ForbiddenError
            }
            const userData = TokenService.decodeToken(accessToken);
            if(!userData){
                return res.json({success:false})
            }
            inviteToken = await InvitationService.create(userData._id, userData.organization)
            res.json({success:true, inviteToken});
        }
        catch(e){
            next(e)
        }
    }
    static async adminRegistration(req: Request, res: Response, next:NextFunction){
       try{
        const organization:IOrganization = {
            name: req.body.organizationName,
            hq_address: req.body.hq_address,
            departmentsId: [],
            adminsId: []
        }
        const user:IUser = {
            email:req.body.email,
            name: req.body.name,
            password: req.body.password,
            roles: [RoleType.ADMIN],
        }
        const userData = await AuthService.adminRegistration(user, organization)
        res.cookie('refreshToken', userData.refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        res.json({
                success: true,
                data: userData 
                    })
        }
        catch(error){
            next(error)
        }
       
       
       
    }
}