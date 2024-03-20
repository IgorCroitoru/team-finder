import {Request, Response, NextFunction} from 'express';
import { UserDto } from '../../shared/dtos/user.dto';
import { RoleString , roleNumberToString} from '../../shared/enums';

function roleAuthorization(roles: RoleString[]) {
    return function(req: Request, res: Response, next: NextFunction) {
      const user = req.user as UserDto;
  if (!user) {
    return res.status(403).json({ message: 'Access denied: No user found.' });
  }
  
  const userRolesAsString: RoleString[] = user.roles!.map(roleNumber => roleNumberToString[roleNumber]);
  
  // Check if the user has at least one of the required roles
  const hasRequiredRole = userRolesAsString.some(role => roles.includes(role));
  if (!hasRequiredRole) {
    // User does not have any of the required roles
    return res.status(403).json({ message: 'Access denied: You do not have the required role.' });
  }
  
  next();
  };
  }

  export default roleAuthorization