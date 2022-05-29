import { Static, Type } from '@sinclair/typebox';
import path from 'path';
import { ajvConsoleLogger, getArgs, isOptions } from '@mauriora/minimist-better-ajv-errors-cli';
import { gitPackage } from './gitPackage';
import { getFile } from './SolutionFile';

const cwd = process.cwd();

enum PublishTarget {
    'git' = 'git'
}

const ArgsSchema = Type.Object(
    {
        solutionPath: Type.Optional(Type.String({
            default: './config/package-solution.json',
            description: 'Used to get paths.zippedPackage'
        })),
        message: Type.Optional(Type.String()),
        _: Type.Optional(Type.Array(
            Type.Enum(PublishTarget),
            {
                description: 'Publish target: [git]',
                minItems: 1,
                maxItems: 1
            }
        ))
    },
    {
        additionalProperties: false
    }
);

type Args = Static<typeof ArgsSchema>;

const publish = (target: PublishTarget, solutionPath: string, message?: string) =>{
    const resolvedPath = path.resolve(cwd, solutionPath);
    const solution = getFile(resolvedPath).solution;
    message ??= `Publish Spfx package ${solution.name} ${solution.version}`;

    switch( target ) {
        case PublishTarget.git:
            gitPackage( solutionPath, message )
            break;
        default:
            throw new Error(`Unkown publish target ${target}`);
    }
}

const main = () => {
    const args: Args = getArgs() as Args;

    if (isOptions(args, ArgsSchema)) {
        publish(args._[0], args.solutionPath, args.message);
    } else {
        ajvConsoleLogger(args, ArgsSchema);
    }
};

main();

