import { simpleProcess } from '@mauriora/simpleprocess';
import { Static, Type } from '@sinclair/typebox';
import { resolve } from 'path';
import { cwd, exit } from 'process';
import { ajvConsoleLogger, getArgs, isOptions } from '@mauriora/minimist-better-ajv-errors-cli';

const ArgsSchema = Type.Object(
    {
        nobrowser: Type.Optional(
            Type.Boolean({
                default: false,
                description: 'This options avoids opening a browser each time serve is started'
            })
        ),

        _: Type.Optional(Type.Array(
            Type.String(),
            {
                maxItems: 0
            }
        )),

        color: Type.Optional(Type.Boolean({ description: 'Ignored' })),
        noDebug: Type.Optional(Type.Boolean({ description: 'Ignored' })),
    },
    {
        additionalProperties: false
    }
);

type Args = Static<typeof ArgsSchema>;

const main = async (): Promise<boolean> => {
    const args: Args = getArgs();

    if (! isOptions(args, ArgsSchema)) {
        ajvConsoleLogger(args, ArgsSchema);
        return false;
    }
    const task = [
        `--cwd "${cwd()}"`,
        `--gulpfile "${resolve(__dirname, '../shared', 'gulpfile.js')}"`,
        'serve-deprecated'
    ];
    if (args.nobrowser) {
        task.push( '--nobrowser')
    }

    return simpleProcess('gulp', task);
};

main()
    .then(result => {
        if (result) {
            exit(0);
        } else {
            exit(1);
        }
    });
