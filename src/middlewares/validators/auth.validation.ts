import {Request,Response, NextFunction } from 'express'
import {body, validationResult, query, param} from 'express-validator'
import { exist } from 'joi';
import jwt from 'jsonwebtoken'
import { Errors } from '../../exceptions/api.error'

const validateUserSignup = [
    body('name')
        .exists().withMessage('Name is required')
        .isLength({min: 2, max: 20}).withMessage('Name must be between 2 and 20 characters'),
    
    body('email')
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid'),
    
    body('password')
        .exists().withMessage('Password is required')
        .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),
    
    body('invitationToken')
        .exists().withMessage('Invitation token is required')
        .custom((value) => {
            try {
                jwt.verify(value, String(process.env.JWT_SIGNUP_SECRET));
                return true; // Token is valid
            } catch (e) {
                throw new Error('Invalid invitation token'); // Correctly throw a new Error
            }
        }),
    (req: Request, res: Response, next: NextFunction) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // No errors, proceed to the next middleware
    }
];

const validateAdminSignUp = [
    body('name')
        .exists().withMessage('Name is required')
        .isLength({min: 2, max: 20}).withMessage('Name must be between 2 and 20 characters'),
    
    body('email')
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid'),
    
    body('password')
        .exists().withMessage('Password is required')
        .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),
    
    body('organizationName')
    .exists().withMessage('Organization name is required')
    .isLength({min: 2, max: 30}).withMessage('Name must be between 2 and 30 characters'),
    body('hq_address')
    .exists().withMessage('Address is required')
    .isLength({min: 2, max: 30}).withMessage('Name must be between 2 and 30 characters'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
]

export default {
    validateUserSignup,
    validateAdminSignUp
}