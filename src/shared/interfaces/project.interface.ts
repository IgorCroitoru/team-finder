import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { RoleType } from "../enums";

export interface IProject {
    _id?: string | mongoose.ObjectId;
    organizationId: string | mongoose.ObjectId;
    managerId: string | mongoose.ObjectId;
    projectName: string;
    projectPeriod: 'Fixed' | 'Ongoing';
    startDate: Date;
    deadlineDate?: Date; // Optional because it's only needed for Fixed projects
    projectStatus: 'Not Started'| 'Starting'| 'In Progress'| 'Closing'| 'Closed';
    generalDescription?: string;
    technologyStack: string[];
    teamRoles: {
      role: string | mongoose.ObjectId; // Assuming role ID is a string, adjust based on your ObjectId representation in TypeScript
      membersNeeded: number;
    }[];
    teamMembers?: {
        proposedMembers: string[] | mongoose.ObjectId[];
        activeMembers: string[]| mongoose.ObjectId[]
        pastMembers: string[] | mongoose.ObjectId[]
    }
  }

export interface IProjectMember {
    _id?:string| mongoose.ObjectId;
    userId: string | mongoose.ObjectId
    confirmedById: string| mongoose.ObjectId;
    teamRoles: string[]| mongoose.ObjectId[];
    comments?: string;
    projectId: string| mongoose.ObjectId;
    workingHours: number,
    status: 'Awaiting'| 'Deleted' | 'Active' | 'Ended'

}

export interface IPropose {
  userId: string| mongoose.ObjectId,
  projectId: string| mongoose.ObjectId;
  workingHours: number;
  comments?: string;
  teamRoles: string[]| mongoose.ObjectId[];
}