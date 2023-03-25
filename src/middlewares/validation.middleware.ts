import {z, ZodEffects, ZodError, ZodSchema} from 'zod';
import {Request, Response, NextFunction, RequestHandler} from 'express';

export enum VALIDATION_TARGET {
    BODY = 'body',
    PARAMS = 'params',
    QUERY = 'query'
}

export class Validator {
    constructor(private schema: ZodSchema | ZodEffects<any>, private target: VALIDATION_TARGET) {}

    public validate(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const validation = await this.schema.safeParseAsync(req[this.target]);

                // lets ignore transpiler and linter here because they do not recognize zod types correctly
                // @ts-ignore
                if (!validation.success) throw new ZodError(validation.error.issues);
                return next(); // No error, lets go on
            } catch (e: any) {
                if(e instanceof ZodError) {
                    console.error(e.toString());
                    return res.status(400).send("Bad request.");
                } else return res.status(500).send(`Internal server error (${e.toString()}`);
            }
        }
    }
}