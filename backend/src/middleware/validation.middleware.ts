import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto(dtoClass: any){
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoInstance);

    if(errors.length > 0){
      const firstError = errors[0];
      const constraints = firstError?.constraints;
      const errorMessage = constraints ? Object.values(constraints)[0] : 'Validation failed';

      return res.status(400).json({ message: errorMessage });
    }

    req.body = dtoInstance;
    next();
  };
}
