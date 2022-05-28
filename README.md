# Spfx Packaging

Typescripts to handle routine tasks with Spfx packages not handled by PnP or sp build tools.
It contains defualt config files to keep project settings in sync.

The wrapper scripts `createPackage`, `servePackage`, `syncVersions`, `publishPackage` provide an uniform way to upgrade the build process.

- [Yarn 2+](#yarn-2)
- [tsconfig.json](#tsconfigjson)
  - [tsconfig example](#tsconfig-example)
- [Wrapper scripts](#wrapper-scripts)
  - [Example use in package.json](#example-use-in-packagejson)
  - [createPackage](#createpackage)
    - [createPackage example](#createpackage-example)
  - [servePackage](#servepackage)
  - [publishPackage](#publishpackage)
  - [syncVersions](#syncversions)
- [Tools](#tools)
  - [incrementVersions](#incrementversions)
  - [generateNewGuidsResetVersions](#generatenewguidsresetversions)
  - [trustDevCert](#trustdevcert)
    - [trustDevCert example](#trustdevcert-example)

## Yarn 2+

Copy the file [.yarnrc.yml](./.yarnrc.yml) to your project. It fixes child module dependency errors  like:

```yaml
packageExtensions:
  "@microsoft/gulp-core-build-typescript@*":
    dependencies:
      "@microsoft/rush-stack-compiler-3.2": "*"
```

## tsconfig.json

This package contains a `tsconfig.json` file to be reused in SPFx projects to ensure a common configuration. It enables a common upgrade as well.

### tsconfig example

tsconfig.json in your project:

```json
{
  "extends": "@mauriora/spfx-packaging/includes/tsconfig.json",
  "compilerOptions": {
    "outDir": "./lib",
    "rootDir": "./src",
    "typeRoots": [
      "./node_modules/@types", "./node_modules/@microsoft"      
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ]
}
```

## Wrapper scripts

`createPackage`, `servePackage`, `syncVersions`, `publishPackage` are Typescript scripts using `@sinclair/typebox` and `better-ajv-errors`.
The intent is to call these scripts from each Spfx project with simple parameters. Upgrade to the process should be done in the scripts, to ensure the same up-to-date process for all projects. They use the common [gulpfile.js](./src/shared/gulpfile.js) .

### Example use in package.json

```json
{
  "scripts": {
    "build": "createPackage --ship",
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

- `bundle`: optional: if set to false then bundle task will be skipped, default is true
- `ship`: optional: if not set then a debug version is build

#### createPackage example

For artifact deployment without built

```shell
createPackage --no-bundle --ship
```

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

### trustDevCert

Call this when you first want to `serve` a package for debugging. It creates and trusts a certificate on your local PC for your local webpack server.

#### trustDevCert example

For artifact deployment without built

```shell
    yarn run trustDevCert
```
