import mongoose, { PipelineStage } from "mongoose";
import { UserModel } from "../models/user.model";
import { RoleType } from "../shared/enums";
import { IUser } from "../shared/interfaces/user.interface";

export class TeamFinderService {

    static async findTeam(reqQuery: any, organizationId: string | mongoose.ObjectId, userId?: string | mongoose.ObjectId){
        const nWeeks: number = Math.max(2, Math.min(reqQuery.nWeeks, 6))
        const nWeeksFromNow = new Date();
        nWeeksFromNow.setDate(nWeeksFromNow.getDate()+nWeeks*7)
        const organizationIdObj = new mongoose.Types.ObjectId(organizationId.toString())
        const pipeline:PipelineStage[] = [
            {$match:
                {
                    organizationId:organizationIdObj,
                    roles: {$in: [RoleType.EMPLOYEE]},
                    departmentId: {$ne: null}
                }},
            {
                $lookup: {
                    from: 'projectmembers',
                    localField: '_id',
                    foreignField: 'userId',
                    pipeline: [
                        {$match: {$expr: {$eq: ['$userId', '$$userId']}}}
                    ],
                    as: 'projectInfo'
                }
            }
        ]
        const users = await UserModel.aggregate(pipeline)
        return users
    }
}