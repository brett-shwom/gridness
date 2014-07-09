var gulp = require('gulp')
  , stylus = require('gulp-stylus')
  , gutil = require("gulp-util")

var EXPRESS_PORT = 9000
  , SRC = './src'
  , BUILD_OUTPUT = __dirname + '/dest'
  , EXPRESS_ROOT = BUILD_OUTPUT
  , LIVERELOAD_PORT = 35729

process.chdir(__dirname) //make paths relative to Gulpfile.js not the cwd


function startExpress() {

  var express = require('express')
  var app = express()
  app.use(require('connect-livereload')())
  app.use(express.static(EXPRESS_ROOT))
  app.get('*', function(request, response) { //pushState support
    response.sendfile(EXPRESS_ROOT + '/index.html')
  })
  app.listen(EXPRESS_PORT)
}

function startLivereload() {

  lr = require('tiny-lr')();
  lr.listen(LIVERELOAD_PORT);
}

// Notifies livereload of changes detected
// by `gulp.watch()`
function notifyLivereload(event) {
  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);

  lr.changed({
    body: {
      files: [fileName]
    }
  });
}

function buildStylus(options) {

    return function (event) {

      gutil.log(gutil.colors.cyan('building stylus'));

      var fileNamePattern
        , relative;

      if (event) { //event is passed by gulp.watch. event.path will contain the path to the file that changed
        fileNamePattern = event.path;

        //TODO: should we use the following for stylus build live reloading?

        // fileNamePattern = event.path;
        // relative = require('path').relative('./src', event.path)

        // gulp.src("**/*" + relative, { cwd : './src' }) //https://github.com/gulpjs/gulp/issues/151 --> It seems that gulp only preserves the directory structure of globs.
        //     .pipe(gulp.dest('./output'));
      }
      else {
        fileNamePattern = SRC +'/*.styl'
      }

      gulp.src(fileNamePattern)
        .pipe(stylus(options))
        .pipe(gulp.dest(options.dest));
    }

}

function copyFontsAndImages(options){

    return function(event) {

      gutil.log(gutil.colors.cyan('copying fonts and images'));

      var fileNamePattern
        , relative;

      if (event) { //event is passed by gulp.watch. event.path will contain the path to the file that changed
        fileNamePattern = event.path;
        relative = require('path').relative(SRC, event.path)

        gulp.src("**/*" + relative, { cwd : SRC}) //https://github.com/gulpjs/gulp/issues/151 --> It seems that gulp only preserves the directory structure of globs.
            .pipe(gulp.dest(options.dest));
      }
      else {
        fileNamePattern = SRC + '/**/*.{svg,otf,woff,ttf,eot,png,jpg}'
      }

      gulp.src(fileNamePattern)
        .pipe(gulp.dest(options.dest));
    }
}

function copyCSS(options) {

    return function(event) {

      gutil.log(gutil.colors.cyan('copying css'));

      var fileNamePattern
        , relative;

      if (event) { //event is passed by gulp.watch. event.path will contain the path to the file that changed
        fileNamePattern = event.path;
        relative = require('path').relative(SRC, event.path)

        gulp.src("**/*" + relative, { cwd : SRC }) //https://github.com/gulpjs/gulp/issues/151 --> It seems that gulp only preserves the directory structure of globs.
            .pipe(gulp.dest(options.dest));
      }
      else {
        fileNamePattern = SRC + '/**/*.css'
      }

      gulp.src(fileNamePattern)
        .pipe(gulp.dest(options.dest));
    }
}

function copyJS(options) {

    return function (event) {

      gutil.log(gutil.colors.cyan('copying js'));

      var fileNamePattern
        , relative

      if (event) { //event is passed by gulp.watch. event.path will contain the path to the file that changed
        fileNamePattern = event.path;
        relative = require('path').relative(SRC, event.path)

        gulp.src("**/*" + relative, { cwd : SRC }) //https://github.com/gulpjs/gulp/issues/151 --> It seems that gulp only preserves the directory structure of globs.
            .pipe(gulp.dest(options.dest));
      }
      else {
        fileNamePattern = SRC + '/**/*.js'
        gulp.src(fileNamePattern)
            .pipe(gulp.dest(options.dest));
      }
    }

}

function copyHTML(options) {

    return function(event) {

      gutil.log(gutil.colors.cyan('copying html'));

      var fileNamePattern;

      if (event) { //event is passed by gulp.watch. event.path will contain the path to the file that changed
        fileNamePattern =  event.path;
      }
      else {
        fileNamePattern = SRC + '/**/*.html'
      }

      gulp.src(fileNamePattern)
        .pipe(gulp.dest(options.dest));
    }
}


gulp.task('build', function () {
  buildStylus({dest : BUILD_OUTPUT})()
  copyHTML({dest : BUILD_OUTPUT})()
  copyJS({dest : BUILD_OUTPUT})()
  copyCSS({dest : BUILD_OUTPUT})()
  copyFontsAndImages({dest : BUILD_OUTPUT})()
});

gulp.task('watch', function () {

  /* watchers */

  gulp.watch(BUILD_OUTPUT + '/**/*.html', notifyLivereload);
  gulp.watch(BUILD_OUTPUT + '/**/*.css', notifyLivereload);
  gulp.watch(BUILD_OUTPUT + '/**/*.js', notifyLivereload);

  /* rebuilders and copiers */
  gulp.watch(SRC + '/**/*.styl', buildStylus({dest : BUILD_OUTPUT}));
  gulp.watch(SRC + '/**/*.js', copyJS({dest : BUILD_OUTPUT}));
  gulp.watch(SRC + '/**/*.html', copyHTML({dest : BUILD_OUTPUT}));
  gulp.watch(SRC + '/**/*.css', copyCSS({dest : BUILD_OUTPUT}));

  /* TODO: watch for changes in fonts */
});

gulp.task('express', function () {
  startExpress();
});

gulp.task('livereload', function () {
  startLivereload();
});

gulp.task('server', ['build', 'express', 'livereload', 'watch']);

gulp.task('default', ['server'])
