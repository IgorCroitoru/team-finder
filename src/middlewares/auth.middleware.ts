import { Request, Response, NextFunction } from "express";
import { Errors } from "../exceptions/api.error";
import { UserModel } from "../models/user.model";
import { TokenService } from "../services/token.service";
import { UserDto } from "../shared/dtos/user.dto";

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return next(Errors.ForbiddenError)
        }
        const accessToken = authHeader.split(' ')[1]
        if(!accessToken)
        {
            return next(Errors.ForbiddenError)
        }
        const userData = TokenService.validateAccessToken(accessToken)
        if(!userData){
            return next(Errors.ForbiddenError)
        }
        const user = await UserModel.findById(userData._id)
        if(!user){
            return next(Errors.ForbiddenError)
        }
        req.user = new UserDto(user)
        req.userExtended = user;
        next()

    }
    catch(e){
        next(e)
    }
}