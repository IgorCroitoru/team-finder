import mongoose from "mongoose";
import { Errors } from "../exceptions/api.error";
import { DepartmentModel } from "../models/department.model";
import { UserModel } from "../models/user.model";
import { DepartmentDto } from "../shared/dtos/department.dto";
import { RoleType } from "../shared/enums";
import { IDepartment } from "../shared/interfaces/department.interface";
import { UserService } from "./user.service";

export class DepartmentService{
    static async create(_department: IDepartment){
        const managerId = _department.manager;
        if(managerId){
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
        }
        const department = await DepartmentModel.create(_department)
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
    static async getDepartments(organizationId: string| mongoose.Schema.Types.ObjectId, page = 1, pageSize = 10){
        const offset = (page - 1) * pageSize;
        const [departments, totalCount] = await Promise.all([
            DepartmentModel.find({organization: organizationId})
            .select('name manager organization')
            .skip(offset)
            .limit(pageSize),
            DepartmentModel.countDocuments({organization: organizationId})
        ]) 
        const pagination = {
            totalRecords: totalCount,
            pageSize,
            currentPage: page,
            totalPages: Math.ceil(totalCount/pageSize)
        }
        return {departments,pagination}
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
            {$pull: {departmentsId:dep._id}},
            {new: true}
            )
        const depDto = new DepartmentDto(dep)
        delete depDto.manager
        return depDto

    }
    static async setManager(departmentId: string | mongoose.Schema.Types.ObjectId, managerId: string | mongoose.Schema.Types.ObjectId){
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
            {new: true})
        if(!department){
            throw new Errors.CustomError('Error creating department', 0 , 500)
        }
        await user.updateOne({$push: {departmentsId: departmentId}}).exec()
        //await user.save();
        //await UserService.assignDepartment(managerId, departmentId);

        
        const depDto = new DepartmentDto(department)
        return depDto
    }
    static async deleteDepartment(departmentId: string | mongoose.Schema.Types.ObjectId){
        const deletedDepartment = await DepartmentModel.findByIdAndDelete(departmentId)
        if(!deletedDepartment){
            throw new Errors.CustomError('Department not found', 0 , 400)
        }
        await UserModel.updateMany(
            { departmentsId: departmentId },
            { $pull: { departmentsId: departmentId } }
        );
        return deletedDepartment._id
    }
}