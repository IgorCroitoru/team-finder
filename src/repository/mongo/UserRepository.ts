import { Types } from "mongoose";
import { IUserRepository } from "../../shared/interfaces/repository/user.rep.interface";
import { IUser } from "../../shared/interfaces/user.interface";
import { UserModel } from "../../models/user.model";
export class UserRepository implements IUserRepository{

    async create(userData: IUser): Promise<IUser> {
        const doc = await UserModel.create(userData)
        return doc.toObject({ versionKey: false }) as IUser
    }
    async findByEmail(email: string): Promise<IUser | null> {
        const doc = await UserModel.findOne({email: email}).exec()
        if (!doc){
            return null
        }
        return doc.toObject({ versionKey: false }) as IUser;
    }
    async findById(id: any): Promise<IUser | null> {
        const doc = await UserModel.findById(id).exec();
        if (!doc){
            return null
        }
        return doc.toObject({ versionKey: false }) as IUser;
    }
    async findOne(query: Partial<IUser> & { [key: string]: any }): Promise<IUser | null>{
       
        return await UserModel.findOne(query).exec();
    }
}