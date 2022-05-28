import { Static, Type } from '@sinclair/typebox';
import { resolve } from 'path';
import { cwd, exit } from 'process';
import { ajvConsoleLogger } from '../shared/args/AjvLogger';
import { getArgs } from '../shared/args/clit';
import { isOptions } from '../shared/args/IsOptions';
import { simpleProcess } from '@mauriora/simpleprocess';


const ArgsSchema = Type.Object(
    {
        _: Type.Optional(Type.Array(
            Type.String(),
            {
                maxItems: 0
            }
        )),

        color: Type.Optional(Type.Boolean({ description: 'Ignored' })),
    },
    {
        additionalProperties: false
    }
);

type Args = Static<typeof ArgsSchema>;


const trustDevCert = async ({}: Args): Promise<boolean> => {

    const gulpOptions = [
        `--cwd "${cwd()}"`,
        `--gulpfile "${resolve(__dirname, '../shared', 'gulpfile.js') }"`
    ];
    const tasks: Array<string> = ['trust-dev-cert'];

    for (const task of tasks) {
        if (false === (await simpleProcess('gulp', [...gulpOptions, task]))) {
            return false;
        }
    }
    return true;
}

const main = async (): Promise<boolean> => {
    const args: Args = getArgs();

    if (! isOptions(args, ArgsSchema)) {
        ajvConsoleLogger(args, ArgsSchema);
        return false;
    }
    return trustDevCert(args);
};

main()
    .then(result => {
        if (result) {
            exit(0);
        } else {
            exit(1);
        }
    });