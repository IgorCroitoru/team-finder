import { Request, Response, NextFunction } from "express";
import { Errors } from "../exceptions/api.error";
import { TokenService } from "../services/token.service";

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return next(Errors.UnauthorizedError)
        }
        const accessToken = authHeader.split(' ')[1]
        if(!accessToken)
        {
            return next(Errors.UnauthorizedError)
        }
        const userData = TokenService.validateAccessToken(accessToken)
        if(!userData){
            return next(Errors.UnauthorizedError)
        }
        req.user = userData
        next()

    }
    catch(e){
        next(e)
    }
}