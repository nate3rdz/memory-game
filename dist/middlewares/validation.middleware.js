import { ZodError } from 'zod';
export var VALIDATION_TARGET;
(function (VALIDATION_TARGET) {
    VALIDATION_TARGET["BODY"] = "body";
    VALIDATION_TARGET["PARAMS"] = "params";
    VALIDATION_TARGET["QUERY"] = "query";
})(VALIDATION_TARGET || (VALIDATION_TARGET = {}));
export class Validator {
    schema;
    target;
    constructor(schema, target) {
        this.schema = schema;
        this.target = target;
    }
    validate() {
        return async (req, res, next) => {
            try {
                const validation = await this.schema.safeParseAsync(req[this.target]);
                // lets ignore transpiler and linter here because they do not recognize zod types correctly
                // @ts-ignore
                if (!validation.success)
                    throw new ZodError(validation.error.issues);
                return next(); // No error, lets go on
            }
            catch (e) {
                if (e instanceof ZodError) {
                    console.error(e.toString());
                    return res.status(400).send("Bad request.");
                }
                else
                    return res.status(500).send(`Internal server error (${e.toString()}`);
            }
        };
    }
}
//# sourceMappingURL=validation.middleware.js.map