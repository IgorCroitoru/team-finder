import mongoose from "mongoose";

export interface ITeamRole{
    _id?: any,
    name: string 
    organizationId: string | mongoose.Schema.Types.ObjectId;
}