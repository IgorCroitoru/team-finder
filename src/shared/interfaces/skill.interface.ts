import {Experience,SkillLevel } from "../enums"
import mongoose from "mongoose"
export interface ISkill{
    _id? : any,
    name: string,
    authorId: string | mongoose.Types.ObjectId
    description: string,
    categoryId: string | mongoose.Schema.Types.ObjectId ,
    departments?: string[] | mongoose.Types.ObjectId[]
    organizationId: string | mongoose.Types.ObjectId
}

export interface ICategory{
    _id?: any
    name: string
    organizationId: string | mongoose.Types.ObjectId
}

export interface IUserSkill{
    _id? : any,
    userId: string | mongoose.Types.ObjectId,
    skillId: string | mongoose.Types.ObjectId,
    initiatedBy: string | mongoose.Types.ObjectId,
    experience: Experience,
    level: SkillLevel,
    confirmedById?: string | mongoose.Types.ObjectId | null
}

