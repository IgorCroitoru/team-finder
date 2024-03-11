import { NextFunction, Request, Response } from 'express';
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
import { UserService } from '../services/user.service';

export class UserController{
   
    constructor(){}

    static async logout(req: Request, res: Response, next:NextFunction){
        try{
            const {refreshToken} = req.cookies
            await TokenService.removeToken(refreshToken)
            res.clearCookie('refreshToken')
            return res.json({success: true})
        }
        catch(e){
            next(e)
        }
    }

    static async refresh(req: Request, res: Response, next:NextFunction){
        try{
            const {refreshToken} = req.cookies
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
            return res.json(userData);
        }
        catch(e){
            next(e)
        }
    }
    static async login(req: Request, res: Response, next:NextFunction){
       try{
        const email = req.body.email
        const password = req.body.password
        const userData = await AuthService.login(email,password);
        res.cookie('refreshToken', userData.refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        res.json({
                success: true,
                data: userData 
                    })
        }
        catch(error){
            console.log(error)
            next(error)
        }
       
       
    }
    
    static async register(req: Request, res: Response, next:NextFunction){
        try{
            const user:IUser = {
                email:req.body.email,
                name: req.body.name,
                password: req.body.password,
            }
            const invitationToken = req.body.invitationToken
            const userData = await AuthService.register(user, invitationToken)
            res.cookie('refreshToken', userData.refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
            res.json({
                    success: true,
                    data: userData 
                     })
        }
        catch(e){
            next(e)
        }
    }
    
}