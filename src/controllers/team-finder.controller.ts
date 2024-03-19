import { Request, Response, NextFunction } from "express";
import { trusted } from "mongoose";
import { Organization } from "../models/org.model";
import { TeamFinderService } from "../services/team-finder.service";
export class TeamFinderController {
    static async findTeam(req: Request, res: Response, next:NextFunction){
        try {
            const reqQuery = req.query
            const organizationId = req.user.organization
            const users = await TeamFinderService.findTeam(reqQuery, organizationId)
            res.json({success:true, users})
        } catch (error) {
            next(error)
        }
    }
}