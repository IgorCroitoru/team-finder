import mongoose, { Schema, Document } from 'mongoose';
import { Experience, SkillLevel } from '../shared/enums';
import { IUserSkill,ISkill, ICategory } from '../shared/interfaces/skill.interface';
import { Organization } from './org.model';

export interface ISkillDoc extends ISkill, Document{}
interface ICategoryDoc extends ICategory, Document{}
interface IUserSkillDoc extends IUserSkill, Document{}
const SkillSchema = new Schema<ISkillDoc>({
  name: { type: String, required: true,index:true },
  organizationId: {type: Schema.Types.ObjectId, ref: 'Organization'},
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  departments: [{type:Schema.Types.ObjectId, ref: 'Department', required: false, default:[] }]
});

const CategorySchema = new Schema<ICategoryDoc>({
    name: { type: String, required: true },
    organizationId: {type: Schema.Types.ObjectId, ref: 'Organization', required:true}
  });

const UserSkillSchema = new Schema<IUserSkillDoc>({
  skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  initiatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index:true },
  experience: { 
    type: String, 
    enum: Object.values(Experience), 
    required: true 
  },
  level: { 
    type: String, 
    enum: Object.values(SkillLevel), // Filters numeric values of the enum
    required: true 
  },
  confirmedById: { type: Schema.Types.ObjectId, ref: 'User', default:null, index:true }
  });
  
export const UserSkill = mongoose.model<IUserSkillDoc>('UserSkill', UserSkillSchema);  
export const Category = mongoose.model<ICategoryDoc>('Category', CategorySchema);
export const Skill = mongoose.model<ISkillDoc>('Skill', SkillSchema);