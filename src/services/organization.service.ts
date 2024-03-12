import mongoose from "mongoose";
import { DepartmentModel } from "../models/department.model";
import { UserModel } from "../models/user.model";
import { UserDto } from "../shared/dtos/user.dto";
import { RoleType } from "../shared/enums";

export class OrganizationService{
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
    static async getNoneDepartmentUsers(organizationId: string | mongoose.Schema.Types.ObjectId, page = 1, pageSize = 10){
        const offset = (page - 1) * pageSize;
        const [users, totalCount] = await Promise.all([
            UserModel.find({
                organizationId: organizationId,
                roles: {$in: [RoleType.EMPLOYEE]},
                $or: [
                    {departmentsId: {$exists: false}},
                    {departmentsId: {$size: 0}}
                ]
                
                })
                .skip(offset)
                .limit(pageSize).exec(),
            UserModel.countDocuments({
                organizationId:organizationId,
                roles: {$in: [RoleType.EMPLOYEE]},
                $or: [
                    {departmentsId: {$exists: false}},
                    {departmentsId: {$size: 0}}
                ]
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
        return {users: usersDto, pagination}

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
}