import { getArgs } from '../shared/args/clit';
import { Static, Type } from '@sinclair/typebox';
import { isOptions } from '../shared/args/IsOptions';
import { ajvConsoleLogger } from '../shared/args/AjvLogger';
import { series, } from 'gulp';
import gulpfileJs from './gulpfile';
import chalk from 'chalk';
import { Task } from 'undertaker';
import { OnDone } from '../shared/gulpTools/OnDone';

const ArgsSchema = Type.Object(
    {
        bundle: Type.Optional(Type.Boolean({
            default: true,
            description: 'if set then bundle task will be skipped'
        })),
        ship: Type.Optional(Type.Boolean({
            description: 'if not set then a debug version is build'
        })),

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

const buildPackge = async ({bundle}: Args) => {
    gulpfileJs();

    const tasks: Task[] = [];
    // tasks.push('clean');
    // if(false !== bundle) {
    //     tasks.push('bundle');
    // }
    tasks.push('package-solution');

    try {
        /**
         * Use series wrapper so  gulp.onStart gulp.onStop now when to finish up.
         * located in node_modules\@microsoft\gulp-core-build\lib\logging.js
        */
        const taskSeries = series(series(tasks));

        await new OnDone().run(taskSeries);
    } catch (jobsError) {
        console.error(`${chalk.red('Error running job')} ${chalk.redBright((jobsError as Error)?.message)}`);
    }
}

const main = async () => {
    const args: Args = getArgs();

    if (isOptions(args, ArgsSchema)) {
        await buildPackge(args);
    } else {
        ajvConsoleLogger(args, ArgsSchema);
    }
};

main();
