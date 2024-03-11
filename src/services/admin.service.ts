import mongoose from "mongoose";
import { UserModel } from "../models/user.model";
import { RoleType } from "../shared/enums";
import { Errors } from "../exceptions/api.error";
import { UserDto } from "../shared/dtos/user.dto";
export class AdminService {

    static async deleteRole(id:string, roleForDeletion: RoleType){
        const user = await UserModel.findOne({_id: id, roles: roleForDeletion})
        if(!user){
            throw Errors.BadRequest
        }
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: id },
            { $pull: { roles: roleForDeletion } },
            { new: true } // Return the document after update was applied
          );
        if(!updatedUser){
            throw Errors.GenericBad
        }
        const userDto = new UserDto(updatedUser)
        return userDto
    }
    static async setRole(id:string, newRole: RoleType){

        const user = await UserModel.findById(id).exec();
        if(!user){
            throw Errors.NonexistentUser
        }
        if(user.roles?.includes(newRole)){
            throw Errors.ExistingRole
        }
        user.roles!.push(newRole)
        await user.save();
        const userDto = new UserDto(user)
        return userDto
    }

    static async getUsers(organizationId: string| mongoose.Schema.Types.ObjectId, page = 1, pageSize = 10){
        const offset = (page - 1) * pageSize;
        const [users, totalCount] =  await Promise.all([
            UserModel.find({organizationId: organizationId})
                .select('email name departmentsId skills roles availableHours')
                .skip(offset)
                .limit(pageSize).exec(),
            UserModel.countDocuments({organizationId: organizationId})
            ])
            const pagination = {
                totalRecords: totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount/pageSize)
            }
        return {users, pagination};

    }
}