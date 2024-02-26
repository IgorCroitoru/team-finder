import { Types } from "mongoose";
import { IUserRepository } from "../../shared/interfaces/repository/user.rep.interface";
import { IUser } from "../../shared/interfaces/user.interface";
import {Errors as Error} from '../../exceptions/api.error'
import { UserModel } from "../../models/user.model";
export class UserRepository implements IUserRepository{
    async createUser(userData: IUser): Promise<IUser> {
        const doc = await UserModel.create(userData)
        return doc.toObject({ versionKey: false }) as IUser
    }
    async findUserByEmail(email: string): Promise<IUser | null> {
        const doc = await UserModel.findOne({email: email}).exec()
        if (!doc){
            return null
        }
        return doc.toObject({ versionKey: false }) as IUser;
    }
    async findUserById(id: string | Types.ObjectId): Promise<IUser | null> {
        const doc = await UserModel.findById(id).exec();
        if (!doc){
            return null
        }
        return doc.toObject({ versionKey: false }) as IUser;
    }
    
}