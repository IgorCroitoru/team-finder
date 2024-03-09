import {Request,Response, NextFunction } from 'express'
import {body, validationResult, query, param} from 'express-validator'
import { exist } from 'joi';
import jwt from 'jsonwebtoken'
import { Errors } from '../../exceptions/api.error'
import { RoleType } from '../../shared/enums';

export const roleUpdateValidator = [
    body('userId')
        .isMongoId()
        .withMessage('The userId must be a valid id.'),
    body('role')
        .custom((value) => Object.values(RoleType).includes(value))
        .withMessage('Invalid role value'),
    (req: Request, res: Response, next: NextFunction) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // No errors, proceed to the next middleware
    }
        
]