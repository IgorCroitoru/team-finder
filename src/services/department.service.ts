import mongoose, { PipelineStage, ObjectId } from "mongoose";
import { CustomError, Errors } from "../exceptions/api.error";
import { DepartmentModel } from "../models/department.model";
import { ProjectMemberModel } from "../models/project.model";
import { Skill } from "../models/skill.model";
import { UserModel } from "../models/user.model";
import { DepartmentDto } from "../shared/dtos/department.dto";
import { UserDto } from "../shared/dtos/user.dto";
import { RoleType } from "../shared/enums";
import { IDepartment } from "../shared/interfaces/department.interface";
import { UserService } from "./user.service";

export class DepartmentService{
    static async create(_department: IDepartment){
        const managerId = _department.manager;
        let user;
        const findDep = await DepartmentModel.findOne({name: _department.name, organization:_department.organization})
        if(findDep){
            throw new Errors.CustomError('Department with this name already exists',0,400)
        }
        if(managerId){
            user = await UserModel.findById(managerId).exec()
            if (!user) {
                throw new Errors.CustomError('User not found', 0, 404); 
            }
            if(!user.roles!.includes(RoleType.DEPARTMENT_MANAGER)){
                throw new Errors.CustomError('User is not a manager', 0, 400);
            }
            const depart = await DepartmentModel.findOne({manager:managerId}).exec()
            if(depart){
                throw new Errors.CustomError(`User is already a manager in ${depart.name}` ,0,400)
            }
        }
        
        const department = await DepartmentModel.create(_department)
        if(!department){
            throw new Errors.CustomError('Error creating department', 0, 500)
        }
        if(user){
            await user.updateOne({departmentId: department._id})
        }
        const departmentDto = new DepartmentDto(department)
        return departmentDto
    }
    static async updateName(newName: string, depName: string){
        const department = await DepartmentModel.findOne({name:depName}).exec()
        if(!department){
            throw new Errors.CustomError('Inexistent department', 0, 400)
        }
        department.name = newName;
        department.save();
        return department
    }
    
    static async deleteManager(departmentId: string | mongoose.Schema.Types.ObjectId){
        const dep = await DepartmentModel.findOneAndUpdate(
            { _id: departmentId },
            { $unset: { manager: "" } } 
            
        );
        if(!dep){
            throw new Errors.CustomError('Unsuccessful deleting manager',0,500)
        }
        await UserModel.findOneAndUpdate(
            {_id: dep.manager},
            { $set: { departmentId: null } },
            {new: true}
            )
        const depDto = new DepartmentDto(dep)
        delete depDto.manager
        return depDto

    }
    static async setManager(departmentId: string | mongoose.Schema.Types.ObjectId,managerId: string | mongoose.Schema.Types.ObjectId){
        const user = await UserModel.findById(managerId).exec()
        if (!user) {
            throw new Errors.CustomError('User not found', 0, 404); 
        }
        if(!user.roles!.includes(RoleType.DEPARTMENT_MANAGER)){
            throw new Errors.CustomError('User is not a manager', 0, 400);
        }
        const depart = await DepartmentModel.findOne({manager:managerId}).exec()
        if(depart){
            throw new Errors.CustomError(`User is already a manager in ${depart.name}` ,0,400)
        }
      
        const department = await DepartmentModel.findOneAndUpdate(
            {_id: departmentId},
            {$set: {manager: managerId}},
            {new: true}).exec()
        if(!department){
            throw new Errors.CustomError('Error creating department', 0 , 500)
        }
        user.updateOne({departmentId: departmentId})
        await user.save();
        //await UserService.assignDepartment(managerId, departmentId);

        
        const depDto = new DepartmentDto(department)
        return depDto
    }
    static async deleteDepartment(departmentId: string | mongoose.Schema.Types.ObjectId, organizationId: string | mongoose.Schema.Types.ObjectId){
        const deletedDepartment = await DepartmentModel.findByIdAndDelete(departmentId)
        if(!deletedDepartment){
            throw new Errors.CustomError('Department not found', 0 , 404)
        }
        await UserModel.updateMany(
            {organizationId: organizationId,
             departmentId: departmentId },
             { $set: { departmentId: null } }
        );
        await Skill.updateMany(
            { organizationId: organizationId },
            { $pull: { departments: departmentId } }
        );
        return deletedDepartment._id
    }
    static async getEmployees(departmentId: string | mongoose.Schema.Types.ObjectId, organizationId: string | mongoose.Schema.Types.ObjectId ,page = 1, pageSize = 10){
        const offset = (page - 1) * pageSize;
        const [users, totalCount] = await Promise.all([
            UserModel.find({
                organizationId: organizationId,
                departmentId: departmentId
                })
                .skip(offset)
                .limit(pageSize).exec(),
            UserModel.countDocuments({
                organizationId: organizationId,
                departmentId: departmentId,
                roles: {$in: RoleType.EMPLOYEE}
            })
            ])
        const pagination = {
            totalRecords: totalCount,
            pageSize,
            currentPage: page,
            totalPages: Math.ceil(totalCount/pageSize)
        }
        const usersDto: UserDto[] = users.map((user)=> {
            return new UserDto(user)
        })
        return {users:usersDto, pagination}
    }
    static async addUser(departmentId: string | mongoose.Schema.Types.ObjectId, userId: string | mongoose.Schema.Types.ObjectId){
        const department = await DepartmentModel.findById(departmentId).exec()
        if(!department){
            throw new Errors.CustomError('Department not found',0,404)
        }
        const user = await UserModel.findById(userId).exec()
        if(!user){
            throw new Errors.CustomError('User not found',0,404)
        }
        if(user.departmentId){
            throw new Errors.CustomError('User is already in a department',0,400)
        }


        await user.updateOne(
            {departmentId: departmentId})
        //await user.save()
        
        return new UserDto(user)

    }
    static async deleteUser(departmentId: string | mongoose.Schema.Types.ObjectId, userId: string | mongoose.Schema.Types.ObjectId){
        const user = await UserModel.findOne({ _id: userId, departmentId: departmentId });
        if(!user){
            throw new CustomError('User not found or does not belong to the department', 0, 404)
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { departmentId: null } }, // Remove the departmentId from the user document
            { new: true }
          );
      
          // If the user could not be updated, throw an error
          if (!updatedUser) {
            throw new Errors.CustomError('Error updating user', 0, 500);
          }
          return new UserDto(updatedUser)

    }
    static async assignSkill(departmentId: string | mongoose.Schema.Types.ObjectId, skillId: string | mongoose.Schema.Types.ObjectId){
        const [department, skill] = await Promise.all([
            DepartmentModel.findById(departmentId),
            Skill.findById(skillId)
        ])
        if(!department) throw new Errors.CustomError('Department does not exists',0,404)
        if(!skill) throw new Errors.CustomError('Skill does not exists',0,404)
        const [updatedDep, updatedSkill] = await Promise.all([
            DepartmentModel.updateOne(
                {_id: departmentId},
                {$addToSet: {skills: skill._id}}),
            Skill.updateOne(
                {_id:skillId},
                {$addToSet: {departments: department._id}}
            )
        ])
        return {updatedDepartment: updatedDep, updatedSkill}
    }
    static async deleteSkill(departmentId: string | mongoose.Schema.Types.ObjectId, skillId: string | mongoose.Schema.Types.ObjectId){
        const [department, skill] = await Promise.all([
            DepartmentModel.findById(departmentId),
            Skill.findById(skillId)
        ])
        if(!department) throw new Errors.CustomError('Department does not exists',0,404)
        if(!skill) throw new Errors.CustomError('Skill does not exists',0,404)
        const [updatedDep, updatedSkill] = await Promise.all([
            DepartmentModel.updateOne(
                {_id: departmentId},
                {$pull: {skills: skill._id}}),
            Skill.updateOne(
                {_id:skillId},
                {$pull: {departments: department._id}}
            )
        ])
        return {updatedDepartment: updatedDep, updatedSkill}
    }
    /**
     * 
     * @param departmentId 
     * @returns projects fromm a specific department
     *      */
    static async getProjectsFromDepartment(departmentId: string | mongoose.Schema.Types.ObjectId){
        const pipeline: PipelineStage[] =[
            {
                $match: 
                {status: 'Active'}
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $unwind: "$userData"
            },
            {
            $match: {
                "userData.departmentId": new mongoose.Types.ObjectId(departmentId.toString())
            }
            },
            {
                $lookup: {
                    from: "projects", 
                    localField: "projectId",
                    foreignField: "_id",
                    as: "projectDetails"
                }
            },
            {
                $unwind: "$projectDetails"
            },
            {
                $replaceRoot: { newRoot: "$projectDetails" }
            },
        
        ]
        const projects = await ProjectMemberModel.aggregate(pipeline)
        return projects
    }
    

}