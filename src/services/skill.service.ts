import mongoose from "mongoose";
import { Errors } from "../exceptions/api.error";
import { Category, ISkillDoc, Skill } from "../models/skill.model";
import { ICategory, ISkill } from "../shared/interfaces/skill.interface";
const ObjectId = mongoose.Types.ObjectId
export class SkillService{

    static async getSkills(organizationId: string, reqQuery: any) {
        const pageNumber = parseInt(reqQuery.pageNumber as string) || 1;
        const pageSize = parseInt(reqQuery.pageSize as string) || 10;
        const offset = (pageNumber - 1) * pageSize;
        const departmentId = reqQuery.departmentId as string;
        const managerId = reqQuery.managerId as string;
        const matchConditions:any = {};
        let categoryInput:any;
        matchConditions.organizationId = new ObjectId(organizationId)
        if(departmentId){
          matchConditions.departmentId = new ObjectId(departmentId);
        }
        if(managerId){
          matchConditions.authorId =new ObjectId(managerId);
        }

        if (reqQuery.category) {
          categoryInput = Array.isArray(reqQuery.category) ? reqQuery.category : [reqQuery.category];
        }
        const pipeline = [
          {
            $match: matchConditions,
          },
          // Add lookup stage conditionally
          ...(categoryInput ? [{
            $lookup: {
              from: 'categories', // Adjust to your categories collection name
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $unwind: '$category', // Unwind for filtering in the next match stage
          },
          {
            $match: {
              ...(categoryInput !== null ? { 'category.name': {$in: categoryInput} } : {}),
            },
          }] : []),
          {
            $skip: offset, // Skip documents for pagination
          },
          {
            $limit: pageSize, // Limit the number of documents to the page size
          },
          {
            $project: { 
              _id: 1,
              name: 1,
              authorId: 1,
              description: 1,
              categoryId: 1,
              categoryName: '$category.name',
              departments: 1
            },
          },
        ];
        const countPipeline = [
          {
            $match: matchConditions,
          },
          // If categoryInput is not null, include the $lookup and $match stages
          ...(categoryInput ? [
            {
              $lookup: {
                from: 'categories', // Adjust to your categories collection name
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category',
              },
            },
            {
              $unwind: '$category', // Unwind for filtering in the next match stage
            },
            {
              $match: {
                'category.name': { $in: categoryInput },
              },
            },
          ] : []),
          // Add the $count stage to get the total number of documents
          {
            $count: 'totalCount',
          },
        ];
        
        const results = await Skill.aggregate(pipeline);
        const countResults = await Skill.aggregate(countPipeline);
        const totalCount = countResults.length > 0 ? countResults[0].totalCount : 0;
        const pagination = {
          totalRecords: totalCount,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalCount/pageSize)
      }
        return {
          results,
          pagination

        }   
       
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
    static async deleteCategory(organizationId:string | mongoose.Schema.Types.ObjectId,categoryId?: string | mongoose.Schema.Types.ObjectId, name?: string ){
      if(!categoryId && !name){
        return console.error('You must provide categoryId or name');
      }
      const searchQuery:any = {organizationId}
      if(categoryId) searchQuery.categoryId = categoryId
      if(name) searchQuery.name = name
      const category = await Category.findOneAndDelete(searchQuery)
      if(!category){
        throw new Errors.CustomError('This category does not exists',0,404)
      }
      return category
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
        if(!skillId && !name){
            return console.error('You have to provide at least one parameter')
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
    static async updateCategory(
      organizationId: string | mongoose.Schema.Types.ObjectId ,
      newName: string,
      categoryId?: string | mongoose.Schema.Types.ObjectId ,
      name?: string,)
       {
      if(!categoryId && !name){
        return console.error('You have to provide at least one parameter')
      }
      const searchQuery:any = {organizationId}
      if(categoryId) searchQuery.categoryId = categoryId
      if(name) searchQuery.name = name
      const updated = await Category.findOneAndUpdate(searchQuery, {name:newName})
      if(!updated){
        throw new Errors.CustomError('No document has been updated',0,304)
      }
      return updated

    }
}