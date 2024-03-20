import { Errors, CustomError } from '../exceptions/api.error';
import { Request, Response, NextFunction } from 'express';
export default function (err: Error, req:Request, res:Response, next: NextFunction) {
    // Check if the error is one of your custom error types
    if (err instanceof CustomError) {
        // It's one of our custom errors
        return err.respond(res);
      } else {
        // It's not a recognized custom error, log it and respond with a generic error
        console.error(err);
        return Errors.GenericBad.respond(res);
      }
    }