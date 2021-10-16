import { ErrorObject } from "ajv/dist/2019";

/** Convert Ajv ~8.6 errors for better-ajv-errors. Adding the dataPath property set to instancePath. */
export const convertAjv8Errors = (errors: ErrorObject[]) =>
    errors.map(err => ({
        dataPath: err.instancePath,
        ...err
    }));
