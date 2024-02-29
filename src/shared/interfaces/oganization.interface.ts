import mongoose from "mongoose"
import { IUser } from "./user.interface"
export interface IOrganization{
    _id?: any
    name: string,
    hq_address: string,
    adminsId: string[] | mongoose.Schema.Types.ObjectId[]
    departmentsId: string[] | mongoose.Schema.Types.ObjectId[]
    creator?: string | mongoose.Schema.Types.ObjectId
}