import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import { string } from 'joi';
import { UserDto } from '../shared/dtos/user.dto';
import { IToken } from '../shared/interfaces/token.interface';
import { TokenRepository } from '../repository/mongo/TokenRepository';
import { TokenModel } from '../models/token.model';
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from '../../constants';

dotenv.config()
export  class TokenService {
    constructor(){}
     static generateTokens(payload: UserDto): any {
        const accessToken = jwt.sign(payload, String(process.env.JWT_ACCESS_SECRET), {expiresIn: ACCESS_TOKEN_EXPIRATION})
        const refreshToken = jwt.sign(payload, String(process.env.JWT_REFRESH_SECRET), {expiresIn: REFRESH_TOKEN_EXPIRATION})
        return {
            accessToken,
            refreshToken
        }
    }
     static isValidAccessToken(token: string): boolean{
        try{
        const user = jwt.verify(token, String(process.env.JWT_ACCESS_SECRET))
        if(user) return true
        return false
        }
        catch(err) {return false}
        
    }
     static decodeToken(token: string){
        try{
            const decoded = jwt.decode(token, {json: true})
            console.log(decoded)
            return decoded
        }
        catch(e){
            throw e
        }
     }

     static isValidRefreshToken(token: string): boolean{
        try{
        const user = jwt.verify(token, String(process.env.JWT_REFRESH_SECRET))
        if(user) return true
        return false
        }
        catch(err) {return false}
        
    }

    static async findToken(refreshToken: string): Promise<IToken | null>{
        const token = await TokenModel.findOne({refreshToken}).exec();
        if(!token){
            return null
        }
        return token;
    }
    static async createToken(token:IToken): Promise<IToken>{
        const newToken = await TokenModel.create({...token})
        return newToken
    }
}