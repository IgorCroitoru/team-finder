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
import { TokenService } from './token.service';
import { UserModel } from '../models/user.model';
import {IUser} from "../shared/interfaces/user.interface"
dotenv.config()

export class UserService {

    static async refresh(refreshToken: string){
        if(!refreshToken){
            throw Errors.UnauthorizedError
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw Errors.UnauthorizedError
        }
        const user:IUser | null = await UserModel.findById(userData._id);
        if(!user){
            throw Errors.NonexistentUser
        }
        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({...userDto});
        await TokenService.saveToken(user._id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    
}