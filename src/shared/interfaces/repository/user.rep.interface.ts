import mongoose from "mongoose";
import { IUser } from "../user.interface";

export interface IUserRepository {
    createUser(userData: IUser): Promise<IUser>;
    findUserByEmail(email: string): Promise<IUser | null>;
    findUserById(id: string | mongoose.Types.ObjectId):Promise <IUser|null>;
    
  }