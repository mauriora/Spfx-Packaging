import chalk from 'chalk';
import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';
import { getVersion } from './SolutionFile';

const cwd = process.cwd();

interface SolutionFile {
    '$schema': 'https://developer.microsoft.com/json-schemas/spfx-build/package-solution.schema.json';
    paths: {
        zippedPackage: string;
    }
}

/**
 * Extract SharePoint package file from config/package-solution.json > paths.zippedPackage.
 * @param solutionPath 
 * @returns path in local sharepoint folder to ??.sppkg file
 * @example solution/announcements-bar.sppkg
 */
const getPathFromSolution = (solutionPath: string) =>
    (require(solutionPath) as SolutionFile)
        .paths.zippedPackage;

/**
 * Extract SharePoint package file from config/package-solution.json > paths.zippedPackage.
 * @param solutionPath relative path to cwd.
 * @returns local path to ??.sppkg file
 * @example sharepoint/solution/announcements-bar.sppkg
 */
export const getPackagePath = (solutionPath: string) =>
    path.join(
        './sharepoint',
        getPathFromSolution(
            path.resolve(cwd, solutionPath)
        )
    );

export const gitPackage = async (solutionPath: string, message: string) => {
    const version = getVersion(path.resolve(cwd, solutionPath));
    const packageFile = getPackagePath(solutionPath);
    const git: SimpleGit = simpleGit();

    console.log(
        chalk.green('Git: ') +
        chalk.magenta(packageFile) + ' ' +
        chalk.yellow(version) + ' ' +
        message
    );
    const added = await git.add(packageFile);

    if (added) {
        console.log(chalk.green('Git add: ') + chalk.yellow(added));
    }
    const {summary, ...committed} = await git.commit(message, packageFile);
    console.log(
        chalk.green('Git commited: ') +
        (committed.branch ? chalk.yellow(committed.branch) : chalk.red('no-branch')) +
        ' @ ' + 
        (committed.commit ? chalk.yellowBright(committed.commit) : chalk.red('no-commit')) +
        ': ' +
        ( 0 === summary.changes + summary.deletions + summary.insertions ?
            chalk.red('no changes')
            :
            chalk.magentaBright(
                JSON.stringify(summary)
                    .replace(/['\"{}]/g, '')
                    .replace(/,/g, ', ')
            )
        )
    );
    const pushed = await git.push();
    console.log(
        chalk.green('Git pushed:') +
        (undefined === pushed.update ?
            chalk.red(' no update')
            :
            ' head: ' + chalk.magenta(pushed.update.head.local) + ' -> ' + chalk.magentaBright(pushed.update.head.remote) +
            ' hash: ' + chalk.magenta(pushed.update.hash.from) + ' -> ' + chalk.magentaBright(pushed.update.hash.to)
        )
    );
}