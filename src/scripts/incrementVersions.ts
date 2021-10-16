import fs from 'fs';
import versiony from 'versiony';
import chalk from 'chalk';
import { getArgs } from '../shared/args/clit';
import path from 'path';
import { Static, Type } from '@sinclair/typebox';
import { isOptions } from '../shared/args/IsOptions';
import { ajvConsoleLogger } from '../shared/args/AjvLogger';

const cwd = process.cwd();

const ArgsSchema = Type.Object(
    {
        packagePath: Type.Optional(Type.String({
            default: './package.json',
            description: 'If not specified "./package.json" will be used'
        })),
        solutionPath: Type.Optional(Type.String({
            default: './config/package-solution.json',
            description: 'If not specified "./package.json" will be used'
        })),
        _: Type.Optional(Type.Array(
            Type.String(),
            { description: 'addtional json files to update the version property of the root object' }
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

interface JsonFile {
    [key: string]: string | unknown | JsonFile;
}

const updateFile = (options: UpdateFileOptions) => {
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
                console.log(`Updating ${targetName}.${chalk.blueBright(options.arrayProperty)}[${chalk.greenBright(item['title'] ?? item['id'])}].version=${chalk.yellow(newVersion)}`);
                item['version'] = newVersion;
            }
        } else {
            console.error(`${targetName}.${options.arrayProperty} is not an array, it's of type ${typeof array}, constructor.name=${array?.constructor?.name}`, { target });
        }
    }

    fs.writeFileSync(options.file, JSON.stringify(fileContent, null, 4))
}

const main = () => {
    const args: Args = getArgs();

    if (isOptions(args, ArgsSchema)) {
        const options = new UpdateFileOptions();
        options.version = versiony
            .patch()
            .with(args.packagePath)
            .end({ quiet: true })
            .version;

        console.log(`Updated ${chalk.cyan(args.packagePath)} to ${chalk.yellow(options.version)}` );

        for (const additional of args._) {
            options.file = additional;
            options.parts = 3;
            updateFile(options);
        }

        options.file = args.solutionPath;
        options.nestedObject = 'solution';
        options.arrayProperty = 'features';
        options.parts = 4;
        updateFile(options);
    } else {
        ajvConsoleLogger(args, ArgsSchema);
    }
};

main();

