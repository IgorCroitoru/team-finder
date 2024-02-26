import mongoose, { Schema, Document } from 'mongoose';
import { Experience, SkillLevel } from '../shared/enums';
import { IUserSkill,ISkill, ICategory } from '../shared/interfaces/skill.interface';

interface ISkillDoc extends ISkill, Document{}
interface ICategoryDoc extends ICategory, Document{}
interface IUserSkillDoc extends IUserSkill, Document{}
const SkillSchema = new Schema<ISkillDoc>({
  name: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  }
});

const CategorySchema = new Schema<ICategoryDoc>({
    name: { type: String, required: true }
  });

const UserSkillSchema = new Schema<IUserSkillDoc>({
  skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  initiatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  experience: { 
    type: String, 
    enum: Object.values(Experience), 
    required: true 
  },
  level: { 
    type: Number, 
    enum: Object.values(SkillLevel).filter(value => typeof value === 'number'), // Filters numeric values of the enum
    required: true 
  },
  confirmedById: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  });
  
export const UserSkill = mongoose.model('UserSkill', UserSkillSchema);  
export const Category = mongoose.model<ICategoryDoc>('Category', CategorySchema);
export const Skill = mongoose.model<ISkillDoc>('Skill', SkillSchema);