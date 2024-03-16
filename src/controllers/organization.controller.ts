import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "../services/organization.service";

export class OrganizationController {
    static async getUsers(req: Request, res: Response, next:NextFunction){
        try {
            const { page, pageSize } = req.query;
            const pageNumber = parseInt(page as string) || 1;
            const pageSizeNumber = parseInt(pageSize as string) || 10;
      
            
            const reqQuery =  req.query
           
            const organizationId = req.user?.organization; 
            if (organizationId) reqQuery.organizationId = organizationId;
            const users = await OrganizationService.getUsers(reqQuery,pageNumber,pageSizeNumber)
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