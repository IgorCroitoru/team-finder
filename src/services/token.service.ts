import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import { string } from 'joi';
import { UserDto } from '../shared/dtos/user.dto';
import { IToken } from '../shared/interfaces/token.interface';
import { TokenRepository } from '../repository/mongo/TokenRepository';
import { TokenModel } from '../models/token.model';
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from '../../constants';
import { Errors } from '../exceptions/api.error';
import mongoose from 'mongoose';
import { Console } from 'console';

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
            if(decoded){
                return decoded
            }
            else {
                throw Errors.InvalidInvitation
            }
        }
        catch(e){
            throw e
        }
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

     static isValidRefreshToken(token: string): boolean{
        try{
        const user = jwt.verify(token, String(process.env.JWT_REFRESH_SECRET))
        if(user) return true
        return false
        }
        catch(err) {return false}
        
    }

    static validateRefreshToken(token:string){
        try{
            const userData = jwt.verify(token, String(process.env.JWT_REFRESH_SECRET));
            return userData as UserDto;
        }
        catch(e){
            return null
        }
    }

    static validateAccessToken(token:string){
        try{
            const userData = jwt.verify(token, String(process.env.JWT_ACCESS_SECRET));
            return userData as UserDto;
        }
        catch(e){
            return null
        }
    }

    static async removeToken(refreshToken:string){
        const token = TokenModel.deleteOne({refreshToken})
        return token
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
    static async saveToken(userId: string | mongoose.Schema.Types.ObjectId, refreshToken: string){
        const tokenData = await TokenModel.findOne({userId}).exec();
        if(tokenData){
            tokenData.refreshToken = refreshToken

            
            return tokenData.save()
        }
        const token = await TokenModel.create({user: userId, refreshToken})
        return token;
    }
}