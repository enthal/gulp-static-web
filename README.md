# `gulp-static-web`

Opinionated `gulp` tasks for development and build of a static web site, as for a Single Page App.
- Bundles JS (including `node_modules`) via Browserify.
- Compiles CSS via `postcss`, using injected plugins, generating sourcemaps.
- Cache-busts static assets via rev filename thumbprints via `gulp-rev` and `gulp-rev-replace`.

Supplies `build`, `static`, `postcss` tasks.

`build` performs thumbprinting after calling the `default` task (to be supplied by you, the user), which should call `static`, `postcss`, and `browserify` tasks, as needed.


## Example and starter project

See [`gulp-static-web-demo`](../gulp-static-web-demo), which may be used as a starter project!

## Options

**TODO:**  _Document_

## Files and Directories

**TODO:**  _List, and allow for customization_


## Usage

Your `gulpfile.js` might look like:

```javascript
const gulp = require('gulp')
const sequence = require('gulp-sequence').use(gulp)

require('gulp-static-web')( gulp, {
  postcss: [
    // plugins:
    require('postcss-import'),
    require('precss'),
    require('postcss-nested-vars'),
    // ...
  ],
} )

gulp.task('default', sequence('static', ['browserify', 'postcss']))
```

`task('default')` can be extended as you please.


## Development mode

Launch a static web server via `budo` (Browserify + Watchify + LiveReload), watching for changes handled by `static` and `postcss` tasks.

```bash
gulp dev
```

If you need to extend this:

```bash
gulp dev:all
```
... to which you must supply task `'watch:all'`, which should depend on task `watch`. E.g., to include a task `'template'`:

```javascript
gulp.task('watch:all', ['watch', 'template'], () => {
  gulp.watch( ['templates/**'], ['template'] )
})
```


## Production build

```bash
gulp build
```

`build` performs thumbprinting after calling the `default` task (to be supplied by you, the user), which should call `static`, `postcss`, and `browserify` tasks, as needed.

**TODO:**  _Optimize (minify, etc) and allow for more customization_
