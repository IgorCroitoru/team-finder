import { generateJWT } from "../shared/utils/jwt.util";
import {UserModel} from "../models/user.model"
import { UserRepository } from "../repository/mongo/UserRepository";
import { TokenService } from "./token.service";
import { IUser } from "../shared/interfaces/user.interface";
import { Errors } from "../exceptions/api.error";
import bcrypt  from 'bcryptjs';
import dotenv from 'dotenv'
dotenv.config()
export class UserService{
  constructor(private userRepository: UserRepository,
              private tokenService: TokenService){}

  // async adminRegistration()
  async register(user:IUser): Promise<any>{
    const candidate = await this.userRepository.findByEmail(user.email)
    if(candidate){
      throw Errors.UserExist;
    }
    const hashPassword = await bcrypt.hash(user.password,Number(process.env.ROUNDS))
    //const user = 
  }

  
}