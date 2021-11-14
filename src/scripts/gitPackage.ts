import chalk from 'chalk';
import path from 'path';
import simpleGit, { CommitResult, PushResult, SimpleGit } from 'simple-git';
import { getVersion } from './SolutionFile';
import { sync as findParentDir } from 'find-parent-dir';

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

const submitRoot = async (rootModule: string, message: string) => {
    const relativePackage = path.relative(rootModule, cwd);
    const rootName = path.basename(rootModule);

    const git = simpleGit(rootModule);
    console.log(
        chalk.green('Git: ') +
        message + ' ' +
        chalk.greenBright(rootName) + ' ' +
        chalk.yellowBright(relativePackage)
    );
    const added = await git.add(relativePackage);
    logAdded(added);
    const committed = await git.commit(message, relativePackage);
    logCommited(committed);
    const pushed = await git.push();
    logPushed(pushed);
}

export const gitPackage = async (solutionPath: string, message: string) => {
    const version = getVersion(path.resolve(cwd, solutionPath));
    const packageFile = getPackagePath(solutionPath);
    const git: SimpleGit = simpleGit();
    const rootModule = findParentDir(cwd, '.gitmodules');
    const relativeRoot = rootModule ? path.relative(cwd, rootModule) : rootModule;

    console.log(
        chalk.green('Git: ') +
        chalk.magenta(packageFile) + ' ' + chalk.yellow(version) + ' ' +
        message +
        (relativeRoot ?
            chalk.green(' Root: ') +
            chalk.greenBright(relativeRoot)
            :
            ''
        )
    );
    const added = await git.add(packageFile);

    logAdded(added);
    const committed = await git.commit(message, packageFile);
    logCommited(committed);
    const pushed = await git.push();
    logPushed(pushed);

    if (rootModule) {
        submitRoot(rootModule, message);
    }
}

const logPushed = (pushed: PushResult) =>
    console.log(
        chalk.green('Git pushed:') +
        (undefined === pushed.update ?
            chalk.red(' no update')
            :
            ' head: ' + chalk.magenta(pushed.update.head.local) + ' -> ' + chalk.magentaBright(pushed.update.head.remote) +
            ' hash: ' + chalk.magenta(pushed.update.hash.from) + ' -> ' + chalk.magentaBright(pushed.update.hash.to)
        )
    );


const logCommited = (committed: CommitResult) =>
    console.log(
        chalk.green('Git commited: ') +
        (committed.branch ? chalk.yellow(committed.branch) : chalk.red('no-branch')) +
        ' @ ' +
        (committed.commit ? chalk.yellowBright(committed.commit) : chalk.red('no-commit')) +
        ': ' +
        (0 === committed.summary.changes + committed.summary.deletions + committed.summary.insertions ?
            chalk.red('no changes')
            :
            chalk.magentaBright(
                JSON.stringify(committed.summary)
                    .replace(/['\"{}]/g, '')
                    .replace(/,/g, ', ')
            )
        )
    );

const logAdded = (added: string) =>
    added &&
    console.log(chalk.green('Git add: ') + chalk.yellow(added));
