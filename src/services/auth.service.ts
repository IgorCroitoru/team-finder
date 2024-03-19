import {UserModel} from "../models/user.model"
import { Organization } from "../models/org.model";
import { TokenService } from "./token.service";
import { IUser } from "../shared/interfaces/user.interface";
import { Errors } from "../exceptions/api.error";
import bcrypt  from 'bcryptjs';
import dotenv from 'dotenv'
import { UserDto } from "../shared/dtos/user.dto";
import { RoleType } from "../shared/enums";
import { IOrganization } from "../shared/interfaces/organization.interface";
import {generateInvitationToken} from "../shared/utils/index"
import mongoose from "mongoose";
import { IInvitation } from "../shared/interfaces/invite.interface";
import { InvitationService } from "./invitation.service";
dotenv.config()
export class AuthService{
  constructor(){}

  

  static async login(email: string, password: string){
    const user:IUser | null = await UserModel.findOne({email}).select('+password').exec()
    if(!user){
      throw Errors.UserDoesNotExist
    }
    const isEquals = await bcrypt.compare(password, user.password)
    if(!isEquals){
      throw Errors.BadCredentials
    }
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
      
    await TokenService.createToken({ refreshToken: tokens.refreshToken, userId: user._id });
    
    return { ...tokens, user: userDto };
  }

  static async adminRegistration(user: IUser, organization: IOrganization) {
    const candidate = await UserModel.findOne({email:user.email}).exec()
    if(candidate){
      throw Errors.UserExist;
    }
    const hashPassword = await bcrypt.hash(user.password,Number(process.env.ROUNDS) || 10)
    user.password = hashPassword;
   // const session = await mongoose.startSession();
    //session.startTransaction();
    try {
      // Step 1: Create and save the organization
      const org = new Organization({ ...organization });
      await org.save();
  
      // Step 2: Create the admin user
      const adminUser = new UserModel({ ...user });
      await adminUser.save(); // Save to get an _id
  
      // Step 3: Update references
      //org.adminsId.push(adminUser._id);
      org.creator = adminUser._id;
      adminUser.organizationId = org._id;
  
      // Step 4: Save the updated documents
      await adminUser.save();
      await org.save();
  
      // Step 5: Commit the transaction
      //await session.commitTransaction();
  
      // Token operations (consider if these should be part of the transaction or not)
      const userDto = new UserDto(adminUser);
      const tokens = TokenService.generateTokens({ ...userDto });
      
      // Ensure token creation respects the session if it involves DB writes
      await TokenService.createToken({ refreshToken: tokens.refreshToken, userId: adminUser._id });
      
      return { ...tokens, user: userDto };
    } catch (error) {
      console.log(error)
      // Error Handling and Rollback
     // await session.abortTransaction();
      throw Errors.GenericBad
    } finally {
     // session.endSession();
    }
  }
  static async register(_user:IUser, invitationToken: string): Promise<any>{
    if(!invitationToken ) throw Errors.UnauthorizedError
    if(!InvitationService.isValidInvitationToken(invitationToken)) throw Errors.InvalidInvitation
    const candidate =await UserModel.findOne({email:_user.email}).exec()
    if(candidate){
      throw Errors.UserExist;
    }
    const invitationDetails = TokenService.decodeToken(invitationToken) as IInvitation
    const hashPassword = await bcrypt.hash(_user.password,Number(process.env.ROUNDS) || 10)
    _user.password = hashPassword;
    _user.roles = [RoleType.EMPLOYEE]
    _user.organizationId = invitationDetails.organizationId
    const user = await (await UserModel.create(_user));
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({...userDto})
    await TokenService.createToken({refreshToken: tokens.refreshToken, userId: user._id })
    return ({...tokens,user: userDto})
    

  }

  
}

