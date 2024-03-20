import { NextFunction, Request, Response } from 'express';
import { COOKIE_SETTINGS } from '../../constants';
import { TokenService } from '../services/token.service';
import { IUser } from '../shared/interfaces/user.interface';
import {AuthService} from '../services/auth.service';
import { RoleType, SkillLevel } from '../shared/enums';
import mongoose from 'mongoose';
import { UserModel } from '../models/user.model';
import { IOrganization } from '../shared/interfaces/organization.interface';
import { Organization } from '../models/org.model';
import { Errors } from '../exceptions/api.error';
import { InvitationService } from '../services/invitation.service';
import { UserDto } from '../shared/dtos/user.dto';
import { UserService } from '../services/user.service';
import { IUserSkill } from '../shared/interfaces/skill.interface';
import { parseExperience, parseSkillLevel } from '../shared/utils';
import { UserSkill } from '../models/skill.model';
import { ProjectService } from '../services/project.service';
import { ok } from 'assert';

export class UserController{
   
    constructor(){}


    static async me(req: Request, res: Response, next:NextFunction){
        try {
            const user = await UserService.me(req.user._id)
            res.json({user})
        } catch (error) {
            next(error)
        }
    }
    static async logout(req: Request, res: Response, next:NextFunction){
        try{
            const {refreshToken} = req.cookies
            await TokenService.removeToken(refreshToken)
            res.clearCookie('refreshToken')
            //res.cookie('refreshToken', '',{...COOKIE_SETTINGS.REFRESH_TOKEN , maxAge: 0});
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
    static async assignSkill(req: Request, res: Response, next: NextFunction) {
        try{
            
          const skillData = req.body.skill;
            skillData.experience = parseExperience(skillData.experience);
            skillData.level = parseSkillLevel(skillData.level);
            if(!skillData.experience){
                return next(new Errors.CustomError('Bad experience value',0,400))
            }
            if(!skillData.level){
                return next(new Errors.CustomError('Bad level value',0,400))
            }
      
          const userSkill: IUserSkill = {
            skillId: skillData._id,
            userId: req.user._id,
            initiatedBy: req.user._id,
            experience: skillData.experience,
            level: skillData.level,
           
          };
      
          const savedSkill = await UserService.assignSkill(userSkill)
          res.json({success:true, skill: savedSkill})
        } catch (error) {
          next(error);
        }
      }
    static async userSkills(req: Request, res: Response, next: NextFunction){
        try {
            const userId = req.params.userId ? req.params.userId : req.user._id

            const skills = await UserService.userSkills(userId)
            res.json({success:true, skills})
        } catch (error) {
            next(error)
        }
    }
    static async removeSkill(req: Request, res: Response, next: NextFunction){
        try {
            const removed = await UserService.removeSkill(req.params.skillId, req.user._id)
            if(!removed) {
                return next(new Errors.CustomError('No skill was removed', 0, 404))
            }
            res.json({success:true, removedSkill: removed})
        } catch (error) {
            next(error)
        }
    }
    static async myProjects(req: Request, res: Response, next: NextFunction){
        try {
            const projects = await UserService.myProjects(req.user._id)
            res.json({success:ok, projects})
        } catch (error) {
            next(error)
        }
    }
      
    
}


