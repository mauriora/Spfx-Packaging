import chalk from 'chalk';
import { promisify } from 'util';
import { exec } from 'child_process';

const asyncExec = promisify(exec);

/**
 * Executes a process async redirecting all output to the default stdout/stderr.
 * @param executable e.g. 'gulp'
 * @param args e.g. 'clean'
 * @returns true if successfull otherwise false
 */
const simpleProcess = async (executable: string, args: string[] ): Promise<boolean> => {
    let exitCode: undefined | number = undefined;
    const commandLine = `${executable} ${args.join(' ')}`;
    const start = Date.now();

    console.log(`Starting: ${chalk.yellow(commandLine)} ...`);
    try {
        const taskPromise = asyncExec(commandLine);
        const child = taskPromise.child

        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);

        child.on('close', (code: number) => {
            if (0 !== (exitCode = code)) {
                console.error(`Errored: ${chalk.yellow(commandLine)}: ${chalk.redBright(code)}`);
                return false;
            }
            console.log(`Finished: ${chalk.yellow(commandLine)}: ${chalk.greenBright(((Date.now()-start)/1000).toFixed(3) + ' s')}`);
        });

        await taskPromise;
    } catch (taskError) {
        console.error(`${chalk.yellow(commandLine)}: ${chalk.redBright((taskError as Error)?.message)}`);
        return false;
    }
    if (undefined === exitCode) {
        console.error(`${chalk.yellow(commandLine)}: ${chalk.redBright('Not closed yet')}`);
    }
}

export default simpleProcess;