import { Static, Type } from '@sinclair/typebox';
import { exit } from 'process';
import { ajvConsoleLogger } from '../shared/args/AjvLogger';
import { getArgs } from '../shared/args/clit';
import { isOptions } from '../shared/args/IsOptions';
import simpleProcess from '../shared/simpleProcess';

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
    const task = ['serve-deprecated'];
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
