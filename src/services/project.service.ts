import { ErrorDescription } from "mongodb";
import mongoose from "mongoose";
import { Errors } from "../exceptions/api.error";
import { ProjectModel } from "../models/project.model";
import { TeamRole } from "../models/teamrole.model";
import { UserModel } from "../models/user.model";
import { RoleType } from "../shared/enums";
import { IProject, IPropose } from "../shared/interfaces/project.interface";

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
       
        const isMemberAlready = ['proposedMembers', 'activeMembers', 'pastMembers'].some(memberType => 
            project.teamMembers && project.teamMembers[memberType as keyof typeof project.teamMembers]
            .map(id => id.toString())
            .includes(propose.userId.toString())
        );
        if(employee.organizationId!==project.organizationId){
            throw new Errors.CustomError('Employee and project are in different organizations',0,400)
        }
        if(isMemberAlready){
            throw new Errors.CustomError('User is already a member of this project',0,400)
        }
        if(employee.availableHours&& employee.availableHours<propose.workingHours){
            throw new Errors.CustomError(`User has only ${employee.availableHours} available hours`,0,400)
        }
        
        if (isMemberAlready) {
            throw new Errors.CustomError('User already exists in project', 1, 400);
        }
    
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
        await project.deleteOne();
        return project
    }
}