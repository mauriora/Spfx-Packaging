import fs from 'fs';
import versiony from 'versiony';
import chalk from 'chalk';

const cwd = process.cwd();

const packagePath = './package.json';
const solutionPath = './config/package-solution.json';
const manifestPath = './release/manifests/RateableAnnouncementsModelDeployment.manifest.json';

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
    const fileContent = require(options.file) as JsonFile;
    const target = options.nestedObject ? fileContent[options.nestedObject] as JsonFile : fileContent;

    target.version = newVersion;
    if (options.arrayProperty) {
        const array = target[options.arrayProperty];
        if (Array.isArray(array)) {
            for (const item of array) {
                console.log(`Updating ${targetName}.${chalk.blueBright(options.arrayProperty)}[${chalk.green(item['title'] ?? item['id'])}].version=${chalk.yellow(newVersion)}`);
                item['version'] = newVersion;
            }
        } else {
            console.error(`${targetName}.${options.arrayProperty} is not an array, it's of type ${typeof array}, constructor.name=${array?.constructor?.name}`, { target });
        }
    }

    fs.writeFileSync(options.file, JSON.stringify(fileContent, null, 4))
}

export const main = () => {
    const options = new UpdateFileOptions();
    const newVersion = versiony
        .patch()
        .with(packagePath)
        .end({ quiet: true });

    options.version = newVersion.version;

    console.log(`Updated ${chalk.cyan(packagePath)} to ${chalk.yellow(newVersion.version)}`);

    options.file = manifestPath;
    options.parts = 3;
    updateFile(options);

    options.file = solutionPath;
    options.nestedObject = 'solution';
    options.arrayProperty = 'features';
    options.parts = 4;
    updateFile(options);
};

main();