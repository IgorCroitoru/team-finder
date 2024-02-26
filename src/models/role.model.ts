import { RoleType } from "../shared/enums";

import mongoose from "mongoose";
const { Schema } = mongoose;


export const RoleSchema = new Schema({
  name: {
    type: Number,
    required: true,
    enum: Object.values(RoleType).filter(value => typeof value === 'number'),
  }
});

export const Role = mongoose.model('Role', RoleSchema);

