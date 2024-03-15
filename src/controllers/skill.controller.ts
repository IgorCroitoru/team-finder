import { Request, Response, NextFunction } from "express";
import { Errors } from "../exceptions/api.error";
import { Skill } from "../models/skill.model";
import { SkillService } from "../services/skill.service";
import { ICategory, ISkill } from "../shared/interfaces/skill.interface";

export class SkillController{

    static async getSkills(req: Request, res: Response, next:NextFunction){
        try{
            const organizationId = req.user.organization
            const departmentId = req.user.department
            const reqQuery = req.query
            if(reqQuery.myDepartment === 'true'){
                reqQuery.departmentId = departmentId
            }
            if(reqQuery.myCreations === 'true'){
                reqQuery.managerId = req.user._id
            }
            
            const skills = await SkillService.getSkills(organizationId, reqQuery)
            res.json({success:true, ...skills})
        }catch(error){
            next(error)
        }
    }
    static async findCategory(req: Request, res: Response, next:NextFunction){
        try {
            const organizationId = req.user.organization
            const name = req.body.name
            const categoryId = req.body._id
            const query:any = {name,categoryId}
            const category = await SkillService.findCategory(organizationId, query)
            if(!category){
                next(new Errors.CustomError('Category not found',0,404))
            }
            res.json({success:true, category})
        } catch (error) {
            next(error)
        }
    }
    static async createCategory(req: Request, res: Response, next:NextFunction){
        try{
        const category:ICategory = {
            name: req.body.name,
            organizationId: req.user.organization
        }
        const createdCategory = await SkillService.createCategory(category);
        res.json({success:true, category:createdCategory})
        }catch(error){
            next(error)
        }
    }
    static async deleteCategory(req: Request, res: Response, next:NextFunction){
        try {
            const name = req.body.name
            const categoryId = req.body._id
            const organizationId = req.user.organization

            const deleted = await SkillService.deleteCategory(organizationId, categoryId,  name)
            res.json({success:true, deletedCategory: deleted})
        } catch (error) {
            next(error)
        }
    }
    static async updateCategory(req: Request, res: Response, next:NextFunction){
        try{
            const name = req.body.name
            const newName = req.body.newName
            const categoryId = req.body._id
            const organizationId = req.user.organization
            const updated = await SkillService.updateCategory(organizationId,newName,categoryId,name)
            res.json({success:true, updatedCategory: updated})
        }catch(error){
            next(error)
        }
    }
    static async createSkill(req: Request, res: Response, next:NextFunction){
        try{
            let newCategory = false
            const {skill} = req.body
            const query:any = {}
            if(skill.category.name&&skill.category._id){
                delete skill.category.name
            }
            if(skill.category.name) {
                query.name = skill.category.name.trim()
                const category = await SkillService.findCategory(req.user.organization, query)
                if(!category){
                    
                    const category:ICategory = {
                        name: skill.category.name,
                        organizationId: req.user.organization
                    }
                    const createdCategory = await SkillService.createCategory(category)
                    skill.category._id = createdCategory._id
                    skill.category.name = createdCategory.name
                    newCategory = true
                }
                else{
                    skill.category._id = category._id
                }
                
            }
            else if(skill.category._id){
                query._id = skill.category._id
                const category = await SkillService.findCategory(req.user.organization, query)
                if(!category) return next(new Errors.CustomError('This category does not exist',0,404))
                
            }
            const skillObj:ISkill = {
                name: skill.name,
                description:skill.description,
                authorId: req.user._id,
                organizationId: req.user.organization,
                categoryId: skill.category._id
            }
            if(skill.setMyDepartment === true){
                skillObj.departments = [req.user.department]
            }
            const createdSkill = await SkillService.createSkill(req.user.organization, skillObj)
            res.json({success: true, skill:createdSkill, newCategory})
        }catch(error){
            next(error)
        }
    }

}