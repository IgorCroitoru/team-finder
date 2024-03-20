import mongoose from "mongoose";

export interface IDepartment {
    _id?: any
    name: string
    skills?: string[] | mongoose.Schema.Types.ObjectId[]
    manager?: string | mongoose.Schema.Types.ObjectId,
    organization: string | mongoose.Schema.Types.ObjectId
}