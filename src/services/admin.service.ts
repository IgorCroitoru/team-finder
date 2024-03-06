import mongoose from "mongoose";
import { UserModel } from "../models/user.model";

export class AdminService {

    static async getUsers(organizationId: string| mongoose.Schema.Types.ObjectId, page = 1, pageSize = 10){
        const offset = (page - 1) * pageSize;
        const users = await UserModel.find({organizationId: organizationId})
        return users;

    }
}