import { IUserSkill } from "./skill.interface";
import { RoleType } from "../enums";
import mongoose from "mongoose";

interface IRole {
  name: 'ADMIN' | 'DEPARTMENT_MANAGER' | 'PROJECT_MANAGER' | 'EMPLOYEE';
  // Include other properties that a role might have
}

export interface IUser {
   // _id? : string
    email: string
    password: string
    name: string
    availableHours?: number
    skills?: IUserSkill[]
    departmentId?: string
    role?: RoleType[]
    //projects:
  }

