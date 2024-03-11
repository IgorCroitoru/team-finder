import {Request, Response, NextFunction} from 'express';
import { Errors } from '../exceptions/api.error';
import { DepartmentService } from '../services/department.service';
import { DepartmentDto } from '../shared/dtos/department.dto';
import { IDepartment } from '../shared/interfaces/department.interface';
export class DepartmentController{
    static async create(req: Request, res: Response, next:NextFunction){
        try{
            const department: IDepartment = {
                name: req.body.department.name,
                manager: req.body.department.manager ?? undefined,
                organization: req.user.organization
            }

            const newDepartment = await DepartmentService.create(department);
            
            return  res.json({success:true, department: newDepartment})
        }catch(error){
            next(error)
        }
    }
    static async setManager(req: Request, res: Response, next:NextFunction){
        try{
            const departmentId = req.params.departmentId;
            const depManager = req.body.manager
            const department = await DepartmentService.setManager(departmentId, depManager);
            res.json({success:true, department})
        }catch(error){
            next(error)
        }
    }
    static async deleteManager(req: Request, res: Response, next:NextFunction){
        try{
            const departmentId = req.params.departmentId;
            const department = await DepartmentService.deleteManager(departmentId);
            res.json({success:true, department})
        }catch(error){
            next(error)
        }
    }
    static async getDepartments(req: Request, res: Response, next:NextFunction){
        try{
            const organizationId = req.user!.organization!
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const departments = await DepartmentService.getDepartments(organizationId,page, pageSize)
            res.json({...departments})
        }catch(error){
            next(error)
        }
    }
    static async deleteDepartment(req: Request, res: Response, next:NextFunction){
        try {
            const departmentId = req.params.departmentId || req.body.departmentId 
            const deletedId = await DepartmentService.deleteDepartment(departmentId)
            res.json({success: true, deletedId})
        } catch (error) {
            next(error)
        }
    }
}