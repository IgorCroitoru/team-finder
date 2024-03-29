import { Request, Response, NextFunction } from "express";
import { Errors } from "../exceptions/api.error";
import { ProjectService } from "../services/project.service";
import { IProject, IPropose } from "../shared/interfaces/project.interface";

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
           
            if (project.projectPeriod === 'Fixed') {
                if(projBody.deadlineDate){
                project.deadlineDate = new Date(projBody.deadlineDate);
                }
                else{
                return next(new Errors.CustomError('Fixed projects must include deadline date',0,400))
                }
            }
            const newProject = await ProjectService.create(project)
            res.json({success:true, project: newProject})
        } catch (error) {
            next(error)
        }
    }
    static async proposeEmployee(req: Request, res: Response, next:NextFunction){
        try {
            const proposeReq = req.body.propose
            const projectId = req.params.projectId
            const propose: IPropose = {
                userId: proposeReq.userId,
                workingHours: parseInt(proposeReq.workingHours),
                comments: proposeReq.comments,
                teamRole: proposeReq.teamRole,
                projectId: projectId
            }
            const proposeDb = await ProjectService.proposeEmployee(propose)
            res.json({success:true, proposed: proposeDb})
        } catch (error) {
            next(error)
        }
    }

    //where project manager can see his created projects
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
            const projectId = req.params.projectId
            const deleted = await ProjectService.deleteProject(projectId, managerId)
            res.json({success: true, deleted})
        } catch (error) {
            next(error)
        }
    }

}