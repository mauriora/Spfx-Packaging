import * as build from '@microsoft/sp-build-web';

/**
 * This is content of the usual gulpfile.js in the webparts folder.
 * Replaced tslint with eslint, to support TypeScript 4.
 */
 const gulpfileJs = () => {
  // const build: any = require('@microsoft/sp-build-web');
  build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

  /** Disable tslint to enable eslint */
  build.tslintCmd.enabled = false;

  const eslint: any = require('gulp-eslint7');

  const eslintSubTask = build.subTask(
      'eslint',
      (gulp: any /*, buildOptions, done*/ ) =>
          gulp.src(['src/**/*.{ts,tsx}'])
              // eslint() attaches the lint output to the "eslint" property
              // of the file object so it can be used by other modules.
              .pipe(eslint())
              // eslint.format() outputs the lint results to the console.
              // Alternatively use eslint.formatEach() (see Docs).
              .pipe(eslint.format())
              // To have the process exit with an error code (1) on
              // lint error, return the stream and pipe to failAfterError last.
              .pipe(eslint.failAfterError())
  );

  build.rig.addPreBuildTask(build.task('eslint-task', eslintSubTask));

  build.initialize(require('gulp'));
}

export default gulpfileJs;