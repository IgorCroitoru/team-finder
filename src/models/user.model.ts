import { IUser } from "../shared/interfaces/user.interface";
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv'
import { RoleType } from "../shared/enums";
dotenv.config();
interface IUserDoc extends IUser,Document {}
const UserSchema = new Schema<IUserDoc>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    departmentsId: [{type: String, default:[]}],
    organizationId: {type: Schema.Types.ObjectId, ref: 'Organization'},
    roles: [{ 
      type: Number, 
      enum: Object.values(RoleType).filter(value => typeof value === 'number'), 
      required: true,
      default: RoleType.EMPLOYEE 
    }],
    skills: [{ type: Schema.Types.ObjectId, ref: 'UserSkill', default: [] }],
    availableHours: { 
        type: Number, 
        required: true, 
        min: [0, 'Available hours must be between 1 and 8.'], // Min value with custom error message
        max: [8, 'Available hours must be between 1 and 8.'],// Max value with custom error message
        default: 8
      },

    },{
    timestamps: true
  });
// UserSchema.pre<IUserDoc>("save", async function(next) {
//     if (this.isModified('password')) {
//       this.password = await bcrypt.hash(this.password, Number(process.env.ROUNDS));
//     }
//     next();
//   });
  
export const UserModel = mongoose.model<IUserDoc>('User', UserSchema);