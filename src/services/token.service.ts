import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import { string } from 'joi';
import { UserDto } from '../shared/dtos/user.dto';
import { IToken } from '../shared/interfaces/token.interface';
import { TokenRepository } from '../repository/mongo/TokenRepository';

dotenv.config()
export  class TokenService {
    constructor(private tokenRepository: TokenRepository){}
     generateTokens(payload: UserDto): any {
        const accessToken = jwt.sign(payload, String(process.env.JWT_ACCESS_SECRET), {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, String(process.env.JWT_REFRESH_SECRET), {expiresIn: '15d'})
        return {
            accessToken,
            refreshToken
        }
    }
     validateAccessToken(token: string): boolean{
        try{
        const user = jwt.verify(token, String(process.env.JWT_ACCESS_SECRET))
        if(user) return true
        return false
        }
        catch(err) {return false}
        
    }

     validateRefreshToken(token: string): boolean{
        try{
        const user = jwt.verify(token, String(process.env.JWT_REFRESH_SECRET))
        if(user) return true
        return false
        }
        catch(err) {return false}
        
    }

    async findToken(refreshToken: string): Promise<IToken | null>{
        const token = await this.tokenRepository.findOne({refreshToken:refreshToken});
        if(!token){
            return null
        }
        return token;
    }
    async createToken(token:IToken): Promise<IToken>{
        const newToken = await this.tokenRepository.create(token);
        return newToken
    }
}