import mongoose from "mongoose";
import { DepartmentModel } from "../models/department.model";
import { UserModel } from "../models/user.model";
import { UserDto } from "../shared/dtos/user.dto";
import { RoleType } from "../shared/enums";
import { resolveRole } from "../shared/utils";


export class OrganizationService{
    static async getUsers(reqQuery: any, pageNumber = 1, pageSizeNumber = 10){
        const offset = (pageNumber - 1) * pageSizeNumber;
        let hasDepartment:string = reqQuery.hasDepartment;
        const query:any = {}
        query.organizationId = reqQuery.organizationId

        if (reqQuery.roles) {
            const rolesInput = Array.isArray(reqQuery.role) ? reqQuery.role : [reqQuery.role];
            const roles = rolesInput
              .map((role: string) => resolveRole(parseInt(role as string)))
              .filter((role: string) => role !== undefined); // Ensure only valid roles are included
    
            if (roles.length > 0) {
              query.roles = { $in: roles };
            }
          }
        
          if (hasDepartment === 'true') {
            // If hasDepartment is true, look for users where departmentId exists and is not null
            query.departmentId = { $ne: null, $exists: true };
          } else if (hasDepartment === 'false') {
            // If hasDepartment is false, look for users where departmentId is null or does not exist
            query.$or = [
              { departmentId: null }, // Matches documents where departmentId is explicitly set to null
              { departmentId: { $exists: false } } // Matches documents where departmentId does not exist
            ];
          }
  

        const [users, totalCount] =  await Promise.all([
            UserModel.find(query)
                .select('email name departmentId skills roles availableHours')
                .skip(offset)
                .limit(pageSizeNumber).exec(),
            UserModel.countDocuments(query)
            ])
            const pagination = {
                totalRecords: totalCount,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCount/pageSizeNumber)
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
                    { departmentId: null }, // Matches documents where departmentId is explicitly set to null
                    { departmentId: { $exists: false } } // Matches documents where departmentId does not exist
                  ]
                
                })
                .skip(offset)
                .limit(pageSize).exec(),
            UserModel.countDocuments({
                organizationId: organizationId,
                roles: {$in: [RoleType.EMPLOYEE]},
                $or: [
                    { departmentId: null }, // Matches documents where departmentId is explicitly set to null
                    { departmentId: { $exists: false } } // Matches documents where departmentId does not exist
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