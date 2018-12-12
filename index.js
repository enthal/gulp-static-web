
module.exports = (gulp, opts) => {
  const sequence = require('gulp-sequence').use(gulp)
  const rev = require('gulp-rev')
  const revReplace = require('gulp-rev-replace')

  gulp.task('build', sequence('rimraf', 'default', 'rev-replace'))

  gulp.task('css', () => {
    const postcss    = require('gulp-postcss')
    const sourcemaps = require('gulp-sourcemaps')

    return gulp.src(['*.css'])                // e.g., index.css; others can be imported from subdirs via postcss-import plugin and @import
      .pipe( sourcemaps.init() )
      .pipe( postcss(opts.postcss || []) )
      .pipe( sourcemaps.write('.') )
      .pipe( gulp.dest('out/') )
  })

  gulp.task('static', () =>
    gulp.src('./static/**')
      .pipe(gulp.dest('out'))
  )


  // "Private" tasks, implementation details

  gulp.task('revision', () =>
    gulp.src(['out/**', '!**/*.html', '!**/favicon.ico'])
      .pipe(rev())
      .pipe(gulp.dest('build'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('build'))
  )

  gulp.task('no-revision', () =>
    gulp.src(['out/**/*.html', 'out/**/favicon.ico'])
      .pipe(gulp.dest('build'))
  )

  gulp.task('rev-replace', ['revision', 'no-revision'], () =>
    gulp.src(['build/**/*.html', 'build/**/*.css', 'build/**/*.js'])
      .pipe(revReplace({manifest: gulp.src('./build/rev-manifest.json')}))
      .pipe(gulp.dest('build'))
  )

  gulp.task('rimraf', (cb) => {
    const rimraf = require('rimraf')
    rimraf('./out', () => rimraf('./build', cb))
  })

}
