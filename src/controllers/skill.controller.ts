import { Request, Response, NextFunction } from "express";
import { SkillService } from "../services/skill.service";
import { ICategory, ISkill } from "../shared/interfaces/skill.interface";

export class SkillController{
    static async createCategory(req: Request, res: Response, next:NextFunction){
        try{
        const category:ICategory = {
            name: req.body.name
        }
        const createdCategory = await SkillService.createCategory(category);
        res.json({success:true, category:createdCategory})
        }catch(error){
            next(error)
        }
    }
    static async createSkill(req: Request, res: Response, next:NextFunction){
        try{
            const {skill} = req.body
            if(skill.category.name) {
                const category = await SkillService.findCategory(req.user.organization, skill.category.name)
                skill.category._id = category._id
            }
            const skillObj:ISkill = {
                name: skill.name,
                description:skill.description,
                authorId: req.user._id,
                organizationId: req.user.organization,
                departments: [req.user.department],
                categoryId: skill.category._id
            }
            const createdSkill = await SkillService.createSkill(skillObj)
            res.json({success: true, skill:createdSkill})
        }catch(error){
            next(error)
        }
    }

}