import fs from 'fs';
import versiony from 'versiony';
import chalk from 'chalk';
import { getArgs } from '../shared/args/clit';
import path from 'path';
import { Static, Type } from '@sinclair/typebox';
import { isOptions } from '../shared/args/IsOptions';
import { ajvConsoleLogger } from '../shared/args/AjvLogger';
import simpleGit, { SimpleGit } from 'simple-git';

const cwd = process.cwd();

const ArgsSchema = Type.Object(
    {
        packagePath: Type.Optional(Type.String({
            default: './package.json'
        })),
        solutionPath: Type.Optional(Type.String({
            default: './config/package-solution.json'
        })),
        gitAdd: Type.Optional(Type.Boolean({
            default: true,
            description: 'stage modified files'
        })),
        _: Type.Optional(Type.Array(
            Type.String(),
            {
                description: 'addtional json files to update the version property of the root object' 
            }
        ))
    },
    {
        additionalProperties: false
    }
);

type Args = Static<typeof ArgsSchema>;

class UpdateFileOptions {
    file: string;
    version: string;
    nestedObject: string;
    arrayProperty: string;
    parts: 3 | 4 = 3;
}

class UpdateFiles {
    private files = new Array<string>();

    public updateFile = (options: UpdateFileOptions) => {
        const newVersion = options.version + (options.parts === 4 ? '.0' : '');
        const targetName = `${chalk.cyan(options.file)}${options.nestedObject ? '.' + chalk.green(options.nestedObject) : ''}`;

        console.log(`Updating ${targetName}.version=${chalk.yellow(newVersion)}`);

        const filePath = path.resolve(cwd, options.file);
        const fileContent = require(filePath) as JsonFile;
        const target = options.nestedObject ? fileContent[options.nestedObject] as JsonFile : fileContent;

        target.version = newVersion;
        if (options.arrayProperty) {
            const array = target[options.arrayProperty];
            if (Array.isArray(array)) {
                for (const item of array) {
                    console.log(`Updating ${targetName}.${chalk.blueBright(options.arrayProperty)}[${chalk.greenBright(item['title'] ?? item['id'])}].version = ${chalk.yellow(newVersion)}`);
                    item['version'] = newVersion;
                }
            } else {
                console.error(`${targetName}.${options.arrayProperty} is not an array, it's of type ${typeof array}, constructor.name=${array?.constructor?.name}`, { target });
            }
        }

        fs.writeFileSync(options.file, JSON.stringify(fileContent, null, 4));
        this.files.push(options.file);
    }

    public stageModified = async () => {
        const git: SimpleGit = simpleGit();
        const response = await git.add( this.files );
        console.log(`${chalk.green('Git add:')} ${chalk.yellow(response)}`);
    }

}

interface JsonFile {
    [key: string]: string | unknown | JsonFile;
}

const getVersion = (packagePath: string) =>
    versiony
        .from(packagePath)
        .end({ quiet: true })
        .version;

const syncFiles = (args: Args) => {
    const updater = new UpdateFiles();

    const options = new UpdateFileOptions();
    options.version = getVersion(args.packagePath);

    console.log(`Got ${chalk.cyan(args.packagePath)}.Version = ${chalk.yellow(options.version)}` );

    options.parts = 3;

    for (const additional of args._) {
        options.file = additional;
        updater.updateFile(options);
    }

    options.file = args.solutionPath;
    options.nestedObject = 'solution';
    options.arrayProperty = 'features';
    options.parts = 4;

    updater.updateFile(options);

    if(args.gitAdd) {
        updater.stageModified();
    }
}

const main = () => {
    const args: Args = getArgs();

    if (isOptions(args, ArgsSchema)) {
        syncFiles(args);
    } else {
        ajvConsoleLogger(args, ArgsSchema);
    }
};

main();

