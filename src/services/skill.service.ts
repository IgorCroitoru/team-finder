import mongoose from "mongoose";
import { Errors } from "../exceptions/api.error";
import { Category, ISkillDoc, Skill } from "../models/skill.model";
import { ICategory, ISkill } from "../shared/interfaces/skill.interface";

export class SkillService{

    static async getSkills(organizationId: mongoose.Schema.Types.ObjectId, reqQuery: any) {
        const pageNumber = parseInt(reqQuery.pageNumber as string) || 1;
        const pageSize = parseInt(reqQuery.pageSize as string) || 10;
        const departmentId = reqQuery.myDepartment?.departmentId;
        const managerId = reqQuery.myCreations?.managerId;
      
        let query = Skill.find({ organizationId }) as any;
      
        // Conditional filtering for departmentId and managerId
        if (departmentId) {
          query = query.where('departments').in([departmentId]);
        }
        if (managerId) {
          query = query.where('authorId').equals(managerId);
        }
      
        // Conditional population for categoryInput
        if (reqQuery.category) {
          const categoryInput = Array.isArray(reqQuery.category) ? reqQuery.category : [reqQuery.category];
          if (categoryInput.length > 0) {
            query = query.populate({
              path: 'categoryId',
              match: { name: { $in: categoryInput } },
              select: 'name _id'
            });
          }
        }
      
        // Pagination with total count
        const [skills, totalCount] = await Promise.all([
          query.skip((pageNumber - 1) * pageSize).limit(pageSize).exec(), // Execute query for skills
          Skill.countDocuments({ organizationId })
        ]);
        
      
        // Response structure (adjust as needed)
        return {
          skills,
          totalCount,
          pageNumber,
          pageSize
        };
      }
    static async findCategory(organizationId: string | mongoose.Schema.Types.ObjectId ,query:any){
        if(!query.categoryId && !query.name){
            console.error('You have to provide at least one parameter')
        }
        //let query: any = {};
        query.organizationId = organizationId
        
        const category = await Category.findOne(query)
                                        .select('-__v')
                                        .exec()
        if(!category){
            return null
        }
        return category

    }
    static async createCategory(_category:ICategory){
        const findCategory = await Category.findOne({organizationId:_category.organizationId, name:_category.name})
        if(findCategory){
            throw new Errors.CustomError('Category already exists', 0, 400)
        }
        const category = await Category.create(_category)
        return category;
    }
    static async createSkill(organizationId: string | mongoose.Schema.Types.ObjectId,skill: ISkill){
        const findSkill = await Skill.findOne({organizationId,name: skill.name})
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