import mongoose from "mongoose";
import { Errors } from "../exceptions/api.error";
import { Category, Skill } from "../models/skill.model";
import { ICategory, ISkill } from "../shared/interfaces/skill.interface";

export class SkillService{
    static async findCategory(organizationId: string | mongoose.Schema.Types.ObjectId ,categoryId?: string | mongoose.Schema.Types.ObjectId , name?: string){
        if(!categoryId || !name){
            console.error('You have to provide at least one parameter')
        }
        let query: any = {};
        query.organizationId = organizationId
        if (categoryId) query._id = categoryId;
        if (name) query.name = name;
        const category = await Category.findOne(query).exec()
        if(!category){
            throw new Errors.CustomError('Category not found',0,404)
        }
        return category

    }
    static async createCategory(_category:ICategory){
        const findCategory = await Category.findOne({name:_category.name})
        if(findCategory){
            return findCategory
        }
        const category = await Category.create(_category)
        return category;
    }
    static async createSkill(skill: ISkill){
        const findSkill = await Skill.findOne({name: skill.name})
        if(findSkill){
            throw new Errors.CustomError('Skill with this name already exist', 0, 400)
        }
        const newSkill = await Skill.create(skill)
        return newSkill
    }
    static async deleteSkill(organizationId: string | mongoose.Schema.Types.ObjectId ,skillId?: string | mongoose.Schema.Types.ObjectId , name?: string){
        if(!skillId || !name){
            console.error('You have to provide at least one parameter')
        }
        let query: any = {};
        query.organizationId = organizationId
        if (skillId) query._id = skillId;
        if (name) query.name = name;

        // If both skillId and name are provided, both will be used in the query, acting as an AND condition
        const deleted = await Skill.findOneAndDelete(query);
        if(!deleted){
            throw new Errors.CustomError('No skill with specific parameters exist',0,400)
        }
        return deleted
    }
}