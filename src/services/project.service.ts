import { ErrorDescription } from "mongodb";
import mongoose from "mongoose";
import { Errors } from "../exceptions/api.error";
import { ProjectMemberModel, ProjectModel } from "../models/project.model";
import { TeamRole } from "../models/teamrole.model";
import { UserModel } from "../models/user.model";
import { RoleType } from "../shared/enums";
import { IProject, IProjectMember, IPropose } from "../shared/interfaces/project.interface";

export class ProjectService {
    static async create(_project:IProject){
        let errors=[]
        if(_project.managerId){
            const isManager = await UserModel.findById(_project.managerId)
            if(!isManager?.roles?.includes(RoleType.PROJECT_MANAGER)){
                throw new Errors.CustomError('User is not a manager',0,403)
            }
            console.log(_project)
        }
        
        if(!['Starting' , 'Not Started'].includes(_project.projectStatus)){
            throw new Errors.CustomError('New project must have Starting or Not Started status',0,400)
        }
        let validRoles = []
        for(const role of _project.teamRoles){
           
            const roleRecord = await TeamRole.findOne({
                organizationId: _project.organizationId,
                _id: role.role
            })
            if(!roleRecord){
                errors.push(`Role ${role.role} is not existing in your organization`)
            }
            else{
                validRoles.push(role)
            }
        }

        _project.teamRoles = validRoles
        const project = await ProjectModel.create(_project)
        return {project, errors}
    }
    static async getCreatedProjects(managerId: string | mongoose.ObjectId, reqQuery: any){
        const offset = (reqQuery.page - 1)*reqQuery.pageSize
        let query = ProjectModel.find({managerId}).select('_id organizationId projectStatus projectPeriod projectName')
        let totalCount;
        let pagination;
        if(reqQuery.all !== 'true'){
            query.skip(offset).limit(reqQuery.pageSize)
            totalCount = await ProjectModel.countDocuments({managerId})
            pagination = {
                totalRecords: totalCount,
                currentPage: reqQuery.page ,
                totalPages: Math.ceil(totalCount / reqQuery.pageSize ),
            }
            const projects = await query.exec();
            return {projects, pagination}
        }
        
        const projects = await query.exec();
        return {projects}
    }
    static async getProject(projectId:string | mongoose.ObjectId){
        const project = await ProjectModel.findById(projectId)
        if(!project){
            throw new Errors.CustomError('Project does not exists',0,404)
        }
        return project
    }
    //notification
    static async proposeEmployee(propose: IPropose){
        const employee = await UserModel.findById(propose.userId)
        const project = await ProjectModel.findById(propose.projectId)
        if(!employee) throw new Errors.CustomError('Employee not found',0,404)
        if(!project) throw new Errors.CustomError('Project not found',0,404)
        if(!employee.departmentId) throw new Errors.CustomError('User is not in a department',0,400)
       //check if user is not already proposed on that project
        const isMemberAlready = await ProjectModel.aggregate([
            { $match: { _id: project._id } },
            {
                $lookup: {
                    from: 'projectmembers',
                    localField: 'teamMembers.proposedMembers',
                    foreignField: '_id',
                    as: 'proposedMembersInfo'
                }
            },
            {
                $lookup: {
                    from: 'projectmembers',
                    localField: 'teamMembers.activeMembers',
                    foreignField: '_id',
                    as: 'activeMembersInfo'
                }
            },
            {
                $lookup: {
                    from: 'projectmembers',
                    localField: 'teamMembers.pastMembers',
                    foreignField: '_id',
                    as: 'pastMembersInfo'
                }
            },
            {
                $project: {
                    allMembers: { $setUnion: ['$proposedMembersInfo', '$activeMembersInfo', '$pastMembersInfo'] }
                }
            },
            { 
                $match: { 
                    'allMembers.userId': { $eq: employee._id } 
                } 
            }
        ])
        if(employee.organizationId?.toString()!==project.organizationId.toString()){
            throw new Errors.CustomError('Employee and project are in different organizations',0,400)
        }
        if(isMemberAlready.length > 0){
            throw new Errors.CustomError('User is already a member of this project',0,400)
        }
        if(employee.availableHours&& employee.availableHours<propose.workingHours){
            throw new Errors.CustomError(`User has only ${employee.availableHours} available hours`,0,400)
        }
        
       
        const projectMember: IProjectMember = {
            status: 'Awaiting',
            workingHours: propose.workingHours,
            teamRole: propose.teamRole,
            comments: propose.comments,
            userId: propose.userId,
            projectId:propose.projectId
        }
        const projectMemDb = await ProjectMemberModel.create(projectMember);
     
        await project.updateOne(
            {$addToSet: {'teamMembers.proposedMembers': projectMemDb._id }}
       )
        return project
    }
    //only project manager
    static async deleteProject(projectId: string | mongoose.ObjectId, managerId: string | mongoose.ObjectId){
        const project = await ProjectModel.findById(projectId)
        if(!project){
            throw new Errors.CustomError('Non existing project',0,404)
        }
        if(project.managerId.toString() !== managerId.toString()){
            throw new Errors.CustomError('You are not manager of this project',0,403)
        }
        if(['In Progress', 'Closing', 'Closed'].includes(project.projectStatus)){
            throw new Errors.CustomError(`Project has currently "${project.projectStatus}" status and cannot be deleted`,0 ,304)
        }
        const deleted = await project.deleteOne();
        if(deleted.deletedCount>0){
            await ProjectMemberModel.deleteMany({
                projectId: project._id
            })
        }
        return project
    }
    //static async acceptUserToProject()
}