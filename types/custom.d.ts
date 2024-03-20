import { Request } from 'express';
import { UserDto } from '../src/shared/dtos/user.dto';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; 
    userExtended?:any;
  }
}