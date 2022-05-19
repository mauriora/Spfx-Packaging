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

const servePackage = async () => {
    gulpfileJs();

    const tasks: Task[] = [ 'serve-deprecated' ];


    try {
        /**
         * Use series wrapper so  gulp.onStart gulp.onStop know when to finish up.
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
        await servePackage();
    } else {
        ajvConsoleLogger(args, ArgsSchema);
    }
};

main();
