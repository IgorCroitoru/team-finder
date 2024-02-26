import {Experience,SkillLevel } from "../enums"
import mongoose from "mongoose"
export interface ISkill{
    //_id? : string,
    name: string,
    authorId: string | mongoose.Types.ObjectId
    description: string,
    categoryId: string | mongoose.Types.ObjectId
}

export interface ICategory{
    //_id?: string
    name: string
}

export interface IUserSkill{
   // _id? : string,
    skillId: string | mongoose.Types.ObjectId,
    initiatedBy: string | mongoose.Types.ObjectId,
    experience: Experience,
    level: SkillLevel,
    confirmedById: string | mongoose.Types.ObjectId
}

