'use strict';

// Gulp plugins
var del     = require('del'),
    fs      = require('fs'),
    gulp    = require('gulp'),
    merge   = require('merge-stream'),
    path    = require('path'),
    swig    = require('swig'),
    yaml    = require('js-yaml'),
    plugins = require('gulp-load-plugins')({
      rename: { // Make sure these non-standard named gulp plugins load correctly
        'gulp-front-matter': 'frontMatter',
      }
    });

// Plugin configs
var htmlminOpts = {
  removeAttributeQuotes: false,
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: false,
  removeStyleLinkTypeAttributes: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true
}

swig.setDefaults({ cache: false });

// HTML task
gulp.task('html', function() {
  return gulp.src([
    './_src/**/*.html',
    '!./_src/assets/',
    '!./_src/assets/**'
  ])
    .pipe(plugins.plumber())
    .pipe(plugins.frontMatter({ property: 'page', remove: true }))
    .pipe(plugins.data(function(file) {
      return {
        site: yaml.safeLoad(fs.readFileSync('./_data/config.yml', 'utf8')),
        page: file.page
      };
    }))
    .pipe(plugins.tap(function(file) {
      var tpl  = swig.compileFile(file.path),
          data = {
            site: file.data.site,
            page: file.data.page,
            content: file.contents.toString()
          }

      file.contents = new Buffer(tpl(data), 'utf8');
    }))
    .pipe(plugins.htmlmin(htmlminOpts))
    .pipe(plugins.rename('index.html'))
    .pipe(gulp.dest(function(file) {
      if (!file.data.page.homepage) {
        return path.join('./_dist', file.data.page.slug);
      } else {
        return './_dist';
      }
    }))
    .pipe(plugins.size({ title: 'html' }));
});

// Content task
gulp.task('content', function() {
  return gulp.src([
    './_src/**/*.md',
    '!./_src/assets/',
    '!./_src/assets/**'
  ])
    .pipe(plugins.plumber())
    .pipe(plugins.frontMatter({ property: 'page', remove: true }))
    .pipe(plugins.data(function(file) {
      return {
        site: yaml.safeLoad(fs.readFileSync('./_data/config.yml', 'utf8')),
        page: file.page
      };
    }))
    .pipe(plugins.marked())
    .pipe(plugins.tap(function(file) {
      var tpl  = swig.compileFile('./_src/assets/templates/' + file.data.page.template + '.html'),
          data = {
            site: file.data.site,
            page: file.data.page,
            content: file.contents.toString()
          }

      file.contents = new Buffer(tpl(data), 'utf8');
    }))
    .pipe(plugins.htmlmin(htmlminOpts))
    .pipe(plugins.rename('index.html'))
    .pipe(gulp.dest(function(file) {
      return path.join('./_dist', file.data.page.slug);
    }))
    .pipe(plugins.size({ title: 'content' }));
});

// Fonts task
gulp.task('fonts', function() {
  return gulp.src([
    './_src/assets/font/**/*',
  ])
    .pipe(plugins.plumber())
    .pipe(gulp.dest('./_dist/assets/font'))
    .pipe(plugins.size({ title: 'fonts' }));
});

// SCSS task
gulp.task('styles', function() {
  return gulp.src('./_src/assets/scss/styles.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.sass({outputStyle: 'compressed'}))
    .pipe(plugins.autoprefixer('last 1 version'))
    .pipe(plugins.rename('styles.min.css'))
    .pipe(gulp.dest('./_dist/assets/css'))
    .pipe(plugins.size({ title: 'styles' }));
});

// Scripts task
gulp.task('scripts', function() {
  var scripts = gulp.src([
      './_src/assets/js/**/*.js',
    ])
    .pipe(plugins.concat('scripts.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./_dist/assets/js'));

  return scripts.pipe(plugins.plumber())
    .pipe(plugins.size({ title: 'scripts' }));
})

// Optimizes images
gulp.task('images', function() {
  return gulp.src('./_src/assets/img/**/*')
    .pipe(plugins.plumber())
    .pipe(plugins.cache(plugins.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('./_dist/assets/img'))
    .pipe(plugins.size({ title: 'images' }));
});

// Static resources
gulp.task('static', function() {
  return gulp.src('./_src/public/**/*')
    .pipe(plugins.plumber())
    .pipe(gulp.dest('./_dist/'))
    .pipe(plugins.size({ title: 'static' }));
});

// Clear cache
gulp.task('clear', function(done) {
  return require('gulp-cache').clearAll(done);
});

// Build task
gulp.task('build', ['static', 'html', 'content', 'styles', 'scripts', 'fonts', 'images']);

// Watch task
gulp.task('watch', function() {
  gulp.watch(['./_src/**/*.html', './_src/**/*.md', '_data/*.yml'], ['html', 'content']);
  gulp.watch(['./_src/**/*.xml', './_src/**/*.txt'], ['build']);
  gulp.watch(['./_src/assets/scss/**/*.scss'], ['styles']);
  gulp.watch(['./_src/assets/js/**/*.js'], ['scripts']);
});

// Default task
gulp.task('default', ['build', 'watch']);
