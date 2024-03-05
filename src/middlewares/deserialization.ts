import { Request, Response, NextFunction } from "express"
import { Errors } from "../exceptions/api.error";
import { TokenService } from "../services/token.service";
export function deserialize(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let user
    if(token)
    {
        user = TokenService.validateAccessToken(token);
    }
    
    if(user) 
    {
        req.user = user
    }
    next()
    
}