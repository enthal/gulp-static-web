# `gulp-static-web`

Opinionated `gulp` tasks for development and build of a static web site, as for a Single Page App.
- Bundles JS (including `node_modules`) via Browserify.
- Compiles CSS via `postcss`, using injected plugins, generating sourcemaps.
- Cache-busts static assets via rev filename thumbprints via `gulp-rev` and `gulp-rev-replace`.

Supplies `build`, `static`, `postcss` tasks.

`build` performs thumbprinting and calls a `default` task (to be supplied by you, the user), which should call `static` and `postcss` tasks.

## Directories

**TODO**

## Usage

Your `gulpfile.js` might look like:

```javascript
const gulp = require('gulp')
const sequence = require('gulp-sequence').use(gulp)
const gulpStaticWeb = require('gulp-static-web')

gulpStaticWeb(gulp, {
  postcss: [
    require('postcss-import'),
    require('precss'),
    require('postcss-nested-vars'),
    // ...
  ],
})

gulp.task('default', sequence('static', ['browserify', 'postcss']))
```

During development, you might use:

```bash
nodemon \
 -e js \
 -w app/ \
 -w gulpfile.js \
 -x gulp browserify &

nodemon \
 -e js,yml,yaml,html,css \
 -w style/ \
 -w gulpfile.js \
 -x gulp postcss &

nodemon \
 -e js,yml,yaml,html,css \
 -w static/ \
 -w gulpfile.js \
 -x gulp static &
```
