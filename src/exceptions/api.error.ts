class CustomError extends Error {
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
    TTLExceeded: new CustomError('Valve\'s servers didn\'t reply in time', 4, 500),
    GenericBad: new CustomError('Something went wrong on our end, please try again', 6, 500),
    
  };
  