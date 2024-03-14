import mongoose from "mongoose";
import { UserModel } from "../models/user.model";
import { RoleType } from "../shared/enums";
import { Errors } from "../exceptions/api.error";
import { UserDto } from "../shared/dtos/user.dto";
import { ITeamRole } from "../shared/interfaces/teamrole.interface";
import { TeamRole } from "../models/teamrole.model";
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
    static async createTeamRole(teamRole:ITeamRole) {
        const exist = await TeamRole.findOne({name: teamRole.name, organizationId: teamRole.organizationId}).exec()
        if(exist){
            throw new Errors.CustomError("This role already exists",0,400);
        }
        const tr = await TeamRole.create(teamRole)
        return tr
    }
    static async updateTeamRoleName(organizationId: string | mongoose.Schema.Types.ObjectId, oldName: string, newName:string){
        const existRole = await TeamRole.findOne({name: newName})
        if(existRole){
            throw new Errors.CustomError(`${newName} skill already exists`,0,400);
        }
        const newRole = await TeamRole.findOneAndUpdate(
            {organizationId,name: oldName},
            {$set: {name:newName}},
            {new:true}
            )
        if(!newRole){
            throw new Errors.CustomError(`${oldName} skill with that name does not exists`,0 , 404)
        }
        return newRole
    }
    static async getTeamRoles(organizationId: string | mongoose.Schema.Types.ObjectId,page = 1, pageSize = 10){
        const offset = (page - 1) * pageSize;
        const [teamRoles, totalCount] = await Promise.all([
            TeamRole.find({organizationId})
                    .select('-__v -organizationId')
                    .skip(offset)
                    .limit(pageSize).exec(),
            TeamRole.countDocuments({organizationId})
            ])
        const pagination = {
            totalRecords: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount/pageSize)
        }
        return {teamRoles, pagination}
    }
    static async deleteTeamRole(organizationId: string | mongoose.Schema.Types.ObjectId, name: string){
        const deleted = await TeamRole.findOneAndDelete({organizationId,name}).exec()
        if(!deleted){
            throw new Errors.CustomError("Role does not exist", 0, 400)
        }
        return deleted
    }
}