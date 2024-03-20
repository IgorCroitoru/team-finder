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
                organization: req.user.organization
            }
            if(req.body.department.manager){
                department.manager = req.body.department.manager
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
            const department = await DepartmentService.setManager(departmentId,depManager);
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
    
    static async deleteDepartment(req: Request, res: Response, next:NextFunction){
        try {
            const organizationId = req.user.organization
            const departmentId = req.params.departmentId || req.body.departmentId 
            const deletedId = await DepartmentService.deleteDepartment(departmentId, organizationId)
            res.json({success: true, deletedId})
        } catch (error) {
            next(error)
        }
    }
    static async getEmployees(req: Request, res: Response, next:NextFunction){
        try {
            const organizationId = req.user.organization
            const departmentId = req.params.departmentId || req.body.departmentId 
            const users = await DepartmentService.getEmployees(departmentId, organizationId)
            res.json({...users})
        } catch (error) {
            next(error)
        }
    }
    static async addUser(req: Request, res: Response, next:NextFunction){
        try{
            const departmentId = req.params.departmentId
            const userId = req.body.userId
            await DepartmentService.addUser(departmentId, userId)
            res.json({success:true})
        }catch(error){
            next(error)
        }
    }
    static async deleteUser(req: Request, res: Response, next:NextFunction){
        try {
            const departmentId = req.params.departmentId
            const userId = req.body.userId
            await DepartmentService.deleteUser(departmentId, userId)
            res.json({success:true})
        } catch (error) {
            next(error)
        }
    }
    static async assignSkill(req: Request, res: Response, next:NextFunction){
        try {
            const departmentId = req.user.department
            if(!departmentId){
                return next(new Errors.CustomError('User does not have a department',0,404))
            }
            const skillId = req.body.skillId
            const updatedSet = await DepartmentService.assignSkill(departmentId, skillId)
            res.json({success:true, ...updatedSet})
        } catch (error) {
            next(error)
        }
    }
    static async deleteSkill(req: Request, res: Response, next:NextFunction){
        try {
            const departmentId = req.user.department
            if(!departmentId){
                return next(new Errors.CustomError('User does not have a department',0,404))
            }
            const skillId = req.body.skillId
            const updatedSet = await DepartmentService.deleteSkill(departmentId, skillId)
            res.json({success:true, ...updatedSet})
        } catch (error) {
            next(error)
        }
    }
}