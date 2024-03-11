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
import { RoleType } from '../shared/enums';
dotenv.config()

export class UserService {

    

    
    static async logout(refreshToken:string){
        const token = await TokenService.decodeToken(refreshToken)
        return token
    }
    static async assignDepartment(userId: string | mongoose.Schema.Types.ObjectId, departmentId: string | mongoose.Schema.Types.ObjectId){
        const user = await UserModel.findById(userId)
        if(!user){
            throw new Errors.CustomError('User not found', 0, 404); 
        }
        const departmentIdStr = departmentId.toString();
        if (user.departmentsId?.map(id => id.toString()).includes(departmentIdStr)) {
            throw new Errors.CustomError('User is already assigned to this department.', 1, 400);
        }
        const newUser = await UserModel.findOneAndUpdate(
            {_id: userId},
            {$push: {departmentsId: departmentId}},
            {new: true}
        )
        if (!newUser) {
            // Handle the unlikely case where the user does not exist at this point
            throw new Errors.CustomError('Failed to update user with department assignment.', 0, 500);
        }
        const userDto = new UserDto(newUser)
        return userDto; // Optionally return the updated user document
        
        
    }
    

    static async refresh(refreshToken: string){
        if(!refreshToken){
            throw Errors.ForbiddenError
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw Errors.ForbiddenError
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