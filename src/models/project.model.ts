import mongoose from "mongoose";
import { IProject,IProjectMember } from "../shared/interfaces/project.interface";
interface IProjectDoc extends IProject, Document{}
interface IProjectMemberDoc extends IProjectMember, Document{}
const ProjectSchema = new mongoose.Schema<IProjectDoc>({
    organizationId: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required:true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    projectName: { type: String, required: true },
    projectPeriod: { type: String, enum: ['Fixed', 'Ongoing'], required: true },
    startDate: { type: Date, default: Date.now },
    deadlineDate: { type: Date },
    projectStatus: { type: String, enum: ['Not Started', 'Starting', 'In Progress', 'Closing', 'Closed'], required: true },
    generalDescription: { type: String },
    technologyStack: [{ type: String }],
    teamRoles: [{
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamRole' },
        membersNeeded: { type: Number, required: true }
    }],
    teamMembers: {
        proposedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember' , default: []}],
        activeMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember',default: [] }],
        pastMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember',default: [] }]
    },
    
})

const ProjectMemberSchema = new mongoose.Schema<IProjectMemberDoc>({
    status: {type: String, enum: ['Awaiting', 'Deleted', 'Active', 'Ended']},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    confirmedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    comments: {type: String},
    projectId: {type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    teamRoles: [{type: mongoose.Schema.Types.ObjectId, ref: 'TeamRole'}],
    workingHours: {type: Number, 
    required: true, 
    min: [0, 'Available hours must be between 1 and 8.'], // Min value with custom error message
    max: [8, 'Available hours must be between 1 and 8.'],// Max value with custom error message
  },
})
export const ProjectModel = mongoose.model<IProjectDoc>('Project', ProjectSchema)
export const ProjectMemberModel = mongoose.model<IProjectMemberDoc>('ProjectMember', ProjectMemberSchema)