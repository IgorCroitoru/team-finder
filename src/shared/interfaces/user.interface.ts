import { IUserSkill } from "./skill.interface";
import { RoleType } from "../enums";
import mongoose from "mongoose";



export interface IUser {
    _id?: any
    email: string
    password: string
    name: string
    availableHours?: number
    skills?: IUserSkill[]
    departmentId?: string
    roles?: RoleType[]
    organizationId?: string
    //projects:
  }

