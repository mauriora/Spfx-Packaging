export interface SolutionFile {
    '$schema': 'https://developer.microsoft.com/json-schemas/spfx-build/package-solution.schema.json';
    solution: {
        name: string;
        id: string;
        version: string;
    };
    paths: {
        zippedPackage: string;
    };
}

const files = new Map<string, SolutionFile>();

export const getFile = (filePath: string) => {
    let file = files.get(filePath);

    if(! file) {
        file = require(filePath) as SolutionFile;
        files.set(filePath, file);
    }
    return file;
}

export const getVersion = (filePath: string) => 
    getFile(filePath).solution.version;

export const getZippedPackage = (filePath: string) => 
    getFile(filePath).paths.zippedPackage;
