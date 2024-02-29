import mongoose from "mongoose";
import { IUser } from "../user.interface";

export interface IUserRepository extends IGenericRepository<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: any):Promise <IUser|null>;
  }