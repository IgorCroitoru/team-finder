import mongoose from "mongoose";

export interface INotification {
    _id? : string | mongoose.ObjectId;
    type: 'project-proposal' | 'skill-assignment';
    targetUserId: mongoose.ObjectId | string;
    initiatorUserId: mongoose.ObjectId | string;
    relatedProjectId?: mongoose.ObjectId | string;
    relatedSkillId?: mongoose.ObjectId | string;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected';
    seen: boolean;
    createdAt?: Date;
    updatedAt?: Date; 
}