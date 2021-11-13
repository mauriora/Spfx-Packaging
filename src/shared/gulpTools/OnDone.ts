import chalk from "chalk";

export type OnDoneFunction = (error: Error | null) => void;

export class OnDone {
    private resolver: (value: unknown) => void = undefined;
    private readonly promise = new Promise((resolve) => this.resolver = resolve);

    public run = ( f: (onDone: OnDoneFunction) => void): Promise<unknown> =>  {
        f(this.onDone);
        return this.promise;
    }

    private onDone: OnDoneFunction = (error) => {
        if (error) {
            console.error(`${chalk.red('onDone error:')}: ${chalk.redBright(error.message)}`);
        } else {
            console.log(`${chalk.greenBright('onDone')}`);
        }
        this.resolver(undefined);
    }
}
