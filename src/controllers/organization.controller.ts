import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "../services/organization.service";
export class OrganizationController {
    static async getUsers(req: Request, res: Response, next:NextFunction){
        try {

            const organizationId = req.params.organizationId || req.user!.organization!
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const users = await OrganizationService.getUsers(organizationId, page, pageSize)
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
}