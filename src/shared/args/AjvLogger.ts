import betterAjvErrors from "better-ajv-errors";
import { convertAjv8Errors } from "./ConvertAjv8Errors";
import ajv from "./TypeBoxAjv";

export const ajvConsoleLogger = (args: unknown, schema: unknown) => {
    console.error(
        betterAjvErrors(
            schema,
            args,
            convertAjv8Errors(ajv.errors)
        )
    );
}
