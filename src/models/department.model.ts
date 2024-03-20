import mongoose,{Schema}  from "mongoose";
import { IDepartment } from "../shared/interfaces/department.interface";

interface IDepartmentDoc extends IDepartment, Document {}
const departmentSchema = new Schema<IDepartmentDoc>({
    name: {type: String, required: true, unique: true},
    skills: [{type: Schema.Types.ObjectId, ref: 'Skill', required: true, default: [] }],
    manager: {type: Schema.Types.ObjectId, ref: 'User', required: false},
    organization: {type: Schema.Types.ObjectId, ref: 'Organization', required: true},
})

export const DepartmentModel = mongoose.model<IDepartmentDoc>('Department', departmentSchema)