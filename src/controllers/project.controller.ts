import { Request, Response, NextFunction } from "express";
import { Errors } from "../exceptions/api.error";
import { ProjectService } from "../services/project.service";
import { IProject } from "../shared/interfaces/project.interface";

export class ProjectController {
    static async create(req: Request, res: Response, next:NextFunction){
        try {
            const projBody = req.body.project
            const project:IProject={
                managerId: req.user._id,
                organizationId: req.user.organization,
                teamRoles: projBody.teamRoles,
                projectName: projBody.projectName || projBody.name,
                startDate: new Date(projBody.startDate),
                projectStatus: projBody.projectStatus || projBody.status,
                projectPeriod: projBody.projectPeriod || projBody.period,
                technologyStack: projBody.technologyStack,
            }
            

            if (projBody.projectPeriod === 'Fixed') {
                if(projBody.deadlineDate){
                project.deadlineDate = new Date(projBody.deadlineDate);
                }
            }
            const newProject = await ProjectService.create(project)
            res.json({success:true, project: newProject})
        } catch (error) {
            next(error)
        }
    }
    static async getCreatedProjects(req: Request, res: Response, next:NextFunction){
        try {
            const reqQuery = req.query as any;
            reqQuery.page = parseInt(req.query.page as string) || 1;
            reqQuery.pageSize = parseInt(req.query.pageSize as string) || 10;
            const projects = await ProjectService.getCreatedProjects(req.user._id, reqQuery)
            res.json({success:true, ...projects})
        } catch (error) {
            next(error)
        }
    }
    static async getProject(req: Request, res: Response, next:NextFunction){
        try {
            const {projectId} = req.params
            const project = await ProjectService.getProject(projectId)
            res.json({success:true, project})
        } catch (error) {
            next(error)
        }
    }
    static async deleteProject(req: Request, res: Response, next:NextFunction){
        try {
            const managerId = req.user._id
            const projectId = req.body.projectId
            
        } catch (error) {
            next(error)
        }
    }

}