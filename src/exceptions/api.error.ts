export class CustomError extends Error {
    code: number;
    statusCode: number;
  
    constructor(message: string, internalCode: number, statusCode: number) {
      super(message);
      this.name = this.constructor.name;
      this.code = internalCode;
      this.statusCode = statusCode;
    }
  
    getJSON(): { error: string; code: number; status: number } {
      return { error: this.message, code: this.code, status: this.statusCode };
    }
  
    respond(res: any): void {
      res.status(this.statusCode).json(this.getJSON());
    }
  
    toString(): string {
      return `[Code ${this.code}] - ${this.message}`;
    }
  }
  
  export const Errors = {
    CustomError,
    BadParams: new CustomError('Improper Parameter Structure', 1, 400),
    InvalidInspect: new CustomError('Invalid Inspect Link Structure', 2, 400),
    MaxRequests: new CustomError('You have too many pending requests', 3, 400),
    BadRequest: new CustomError('Bad request', 5, 400),
    GenericBad: new CustomError('Something went wrong on our end, please try again', 6, 500),
    UserExist: new CustomError('User with this mail already exist', 7,400),
    NonexistentUser: new CustomError("This user no longer exist", 8, 400),
    UnauthorizedError: new CustomError("You are not authorized",9, 401 ),
    InvalidInvitation: new CustomError('This invitation is not valid', 9, 400)

    
  };
  