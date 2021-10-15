#!/usr/bin/env

const cwd = process.cwd();
const fs = require('fs');
const packagePath = './package.json';
const solutionPath = './config/package-solution.json';
const manifestPath = './release/manifests/RateableAnnouncementsModelDeployment.manifest.json';

const versiony = require('versiony')
const chalk = require('chalk');

class Options {
    file;
    version;
    nestedObject;
    arrayProperty;
    parts = 3;
}

const updateFile = (options) => {
    const newVersion = options.version + (options.parts === 4 ? '.0' : '');
    const targetName = `${chalk.cyan(options.file)}${options.nestedObject ? '.' + chalk.green(options.nestedObject) : ''}`;
    console.log(`Updating ${targetName}.version=${chalk.yellow(newVersion)}`);
    const fileContent = require(options.file);
    const target = options.nestedObject ? fileContent[options.nestedObject] : fileContent;

    target.version = newVersion;
    if (options.arrayProperty) {
        if (typeof target[options.arrayProperty] === 'object') {
            for (const item of target[options.arrayProperty]) {
                console.log(`Updating ${targetName}.${chalk.blueBright(options.arrayProperty)}[${chalk.green(item['title'] ?? item['id'])}].version=${chalk.yellow(newVersion)}`);
                item['version'] = newVersion;
            }
        } else {
            console.error(`${targetName}.${options.arrayProperty} is of type ${typeof target[options.arrayProperty]}`)
        }
    }

    fs.writeFileSync(options.file, JSON.stringify(fileContent, null, 4))
}

function main() {
    const options = new Options();
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
}

main();