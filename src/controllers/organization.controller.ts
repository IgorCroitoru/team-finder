import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "../services/organization.service";
import { resolveRole } from "../shared/utils";

export class OrganizationController {
    static async getUsers(req: Request, res: Response, next:NextFunction){
        try {
            const { page, pageSize, hasDepartment } = req.query;
            const pageNumber = parseInt(page as string) || 1;
            const pageSizeNumber = parseInt(pageSize as string) || 10;
      
            const query: any = {};
            
            if (req.query.roles) {
                const rolesInput = Array.isArray(req.query.roles) ? req.query.roles : [req.query.roles];
                const roles = rolesInput
                  .map(role => resolveRole(parseInt(role as string)))
                  .filter(role => role !== undefined); // Ensure only valid roles are included
        
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
      
            const organizationId = req.user?.organization; 
            console.log(organizationId)
            if (organizationId) query.organizationId = organizationId;
            const users = await OrganizationService.getUsers(query,pageNumber,pageSizeNumber)
            res.json({...users})
        } catch (error) {
            next(error)
        }
    }
    static async getNoneDepartmentUsers(req: Request, res: Response, next:NextFunction){
        try {
            const organizationId = req.user!.organization!
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const users = await OrganizationService.getNoneDepartmentUsers(organizationId, page, pageSize)
            res.json({...users})
        } catch (error) {
            next(error)
        }
    }
    static async getDepartments(req: Request, res: Response, next:NextFunction){
        try{
            const organizationId = req.user!.organization!
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const departments = await OrganizationService.getDepartments(organizationId,page, pageSize)
            res.json({...departments})
        }catch(error){
            next(error)
        }
    }
}