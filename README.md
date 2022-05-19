# Spfx Packaging

## Overview

Type scripts to handle routine tasks with Spfx packages not handled by PnP or sp build tools.

The wrapper scripts `createPackage`, `servePackage`, `syncVersions`, `publishPackage` provide an uniform way to upgrade the build process.

## Wrapper scripts
`createPackage`, `servePackage`, `syncVersions`, `publishPackage` are Typescript gulp scripts using `@sinclair/typebox` and `better-ajv-errors`.
The intent is to call these scripts from each Spfx project with simple parameters. Upgrade to the process should be done in the scripts, to ensure the same up-to-date process for all projects.

### Example use in package.json:
```json
{
  "scripts": {
    "build": "createPackage",
    "serve": "servePackage",
    "version": "syncVersions",
    "publish": "publishPackage git"
  },
  "devDependencies": {
    "@mauriora/spfx-packaging": "^0.0.16"
  }
}
```

### createPackage

Parameters:
- `bundle`: optional: if set then bundle task will be skipped, default is true
- `ship`: optional: if not set then a debug version is build

### servePackage

Parameters:
- `nobrowser`: optional: avoids opening a browser each time serve is started, default: false'

### publishPackage

Parameters:
- `solutionPath`: optional: Used to get paths.zippedPackage, default is './config/package-solution.json'
- `message`: optional: a string publish
- [`git`]: required: target
  - `git`: git.add(packageFile); git.commit(message, packageFile); git.push();

### syncVersions

Parameters:
- `packagePath`: optional: default is './package.json'
- `solutionPath`: optional: default is './config/package-solution.json'
- `gitAdd`: optional: stage modified files, default is true 
- [...]: optional: addtional json files to update the version property of the root object

## Tools
### incrementVersions

increments the version and `package.json` and then use it in the `package-solution.json` and possible `*.manifest.json`

### generateNewGuidsResetVersions

Resets the version to *0.0.1* and generates new GUIDs in `package-solution.json` and for the component in the `*.manifest.json`.
