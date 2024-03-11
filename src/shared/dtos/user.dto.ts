
import mongoose from "mongoose";
import { RoleType } from "../enums";
import { IUser } from "../interfaces/user.interface";
export class UserDto {
    _id?:any
    email: string;
    name: string;
    roles?: RoleType[];
    organization?: string ;
    departments?: string[]
    constructor(user: IUser){
        this._id = user._id
        this.email = user.email
        this.name = user.name
        this.roles = user.roles
        this.organization = user.organizationId?.toString()
        this.departments = user.departmentsId?.map((d)=>{return d.toString()})
    }
}