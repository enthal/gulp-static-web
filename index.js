
module.exports = (gulp, opts) => {
  const sequence = require('gulp-sequence').use(gulp)
  const sourcemaps = require('gulp-sourcemaps')
  const log = require('gulplog');
  const rev = require('gulp-rev')
  const revReplace = require('gulp-rev-replace')

  gulp.task('build', sequence('rimraf', 'default', 'rev-replace'))

  gulp.task('dev', sequence('rimraf', ['watch', 'budo']))
  gulp.task('dev:all', sequence('rimraf', ['watch:all', 'budo']))

  gulp.task('watch', ['postcss', 'static'], () => {
    gulp.watch(
      ['*.css', 'style/**/*.css', 'css/**/*.css'],
      ['postcss'] )
    gulp.watch(
      ['static/**'],
      ['static'] )
  })

  const browserifyOpts = opts.browserify || { debug:true }

  gulp.task('budo', done => {
    const fs = require('fs')
    args = [{
      live: true,             // setup live reload
      dir: 'out',
      serve: 'bundle.js',
      browserify: browserifyOpts,
    }]
    if (fs.existsSync('index.js'))  args.unshift('index.js')
    else  console.log('Budō: no index.js; skipping browserify')

    require('budo')( ...args )
    .on('connect', ev => {
      console.log('Budō: Server running on:', ev.uri)
      // console.log('LiveReload running on port:', ev.livePort)   // BROKEN
      // console.log('Everything:', ev)
    })
    .on('update', buffer => {
      console.log('bundle - %d bytes', buffer.length)
    })
    .on('exit', done)
  })

  gulp.task('browserify', () => {
    const browserify = require('browserify')
    const source = require('vinyl-source-stream')
    const buffer = require('vinyl-buffer')

    return browserify('index.js', browserifyOpts)
      .bundle()
        .on('error', log.error.bind(log, 'Browserify Error'))
      .pipe(source('bundle.js'))  // desired output filename to vinyl-source-stream
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
         // Add transformation tasks to the pipeline here.
      .pipe(sourcemaps.write('.')) // writes .map file
      .pipe(gulp.dest('out'))
  })

  gulp.task('postcss', () => {
    const postcss    = require('gulp-postcss')

    return gulp.src(['*.css'])                // e.g., index.css; others can be imported from subdirs via postcss-import plugin and @import
      .pipe( sourcemaps.init() )
      .pipe( postcss(opts.postcss || [], { parser: opts.postcssParser }) )   // TODO: separate plugins from other postcss opts (as for syntax)
      .pipe( sourcemaps.write('.') )
      .pipe( gulp.dest('out/') )
  })

  gulp.task('static', () =>
    gulp.src(['index.html','static/**'])
      .pipe(gulp.dest('out'))
  )


  // "Private" tasks, implementation details

  gulp.task('revision', () =>
    gulp.src(['out/**', '!**/*.html', '!**/*.pdf', '!**/favicon.ico'])
      .pipe(rev())
      .pipe(gulp.dest('build'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('build'))
  )

  gulp.task('no-revision', () =>
    gulp.src(['out/**/*.html', 'out/**/*.pdf', 'out/**/favicon.ico'])
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
