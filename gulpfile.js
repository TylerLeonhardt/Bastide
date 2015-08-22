// Generated on 2015-05-31 using generator-jekyllized 0.7.3
"use strict";

var del     = require("del"),
    fs      = require("fs"),
    gulp    = require("gulp"),
    merge   = require("merge-stream"),
    path    = require('path'),
    plugins = require("gulp-load-plugins")(),
    yaml    = require('js-yaml');

// HTML task
gulp.task("html", function() {
  return gulp.src(["./_src/**/*.html", "!_src/assets/_bower_components/**/*.html"])
    .pipe(plugins.plumber())
    .pipe(plugins.data(function(file) {
      return yaml.safeLoad(fs.readFileSync('./_data/' + path.basename(file.path) + '.yml', 'utf8'));
    }))
    .pipe(plugins.swig({defaults: {cache: false}}))
    .pipe(gulp.dest("./_dist/"))
    .pipe(plugins.size({ title: "html" }));
});

// Fonts task
gulp.task("fonts", function() {
  return gulp.src(["./_src/assets/fonts/**/*", "./_src/assets/_bower_components/font-awesome/fonts/**/*"])
    .pipe(plugins.plumber())
    .pipe(gulp.dest("./_dist/assets/fonts"))
    .pipe(plugins.size({ title: "fonts" }));
});

// SCSS task
gulp.task("styles", function() {
  return plugins.rubySass("./_src/assets/scss/styles.scss", { style: "compressed" })
    .pipe(plugins.plumber())
    .pipe(plugins.autoprefixer("last 1 version"))
    .pipe(gulp.dest("./_dist/assets/css"))
    .pipe(plugins.size({ title: "styles" }));
});

// Scripts task
gulp.task("scripts", function() {
  var scripts = gulp.src([
    "./_src/assets/js/**/*.js"
  ])
  .pipe(plugins.concat("scripts.min.js"))
  .pipe(gulp.dest("./_dist/assets/js"));

  var foundation = gulp.src([
      "./_src/assets/_bower_components/foundation/js/foundation/foundation.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.abide.js",
      "./_src/assets/_bower_components/foundation/js/foundation/foundation.accordian.js",
      "./_src/assets/_bower_components/foundation/js/foundation/foundation.alert.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.clearing.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.dropdown.js",
      "./_src/assets/_bower_components/foundation/js/foundation/foundation.equalizer.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.interchange.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.joyride.js",
      "./_src/assets/_bower_components/foundation/js/foundation/foundation.magellan.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.offcanvas.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.orbit.js",
      "./_src/assets/_bower_components/foundation/js/foundation/foundation.reveal.js",
      "./_src/assets/_bower_components/foundation/js/foundation/foundation.slider.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.tab.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.tooltip.js",
      //"./_src/assets/_bower_components/foundation/js/foundation/foundation.topbar.js",
    ])
    .pipe(plugins.concat("foundation.min.js"))
    .pipe(gulp.dest("./_dist/assets/js"));

  var modernizr = gulp.src("./_src/assets/_bower_components/foundation/js/vendor/modernizr.js")
    .pipe(gulp.dest("./_dist/assets/js"));

  var jquery = gulp.src("./_src/assets/_bower_components/jquery/dist/jquery.min.js")
    .pipe(gulp.dest("./_dist/assets/js"));

  return merge(foundation, jquery, modernizr, scripts)
    .pipe(plugins.plumber())
    .pipe(plugins.size({ title: "scripts" }));
})

// Optimizes images
gulp.task("images", function() {
  return gulp.src("./_src/assets/img/**/*")
    .pipe(plugins.plumber())
    .pipe(plugins.cache(plugins.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest("./_dist/assets/img"))
    .pipe(plugins.size({ title: "images" }));
});

// Build task
gulp.task("build", ["html", "styles", "scripts", "fonts", "images"]);

// Watch task
gulp.task("watch", function() {
  gulp.watch(["./_src/**/*.html", "_data/*.yml"], ["html"]);
  gulp.watch(["./_src/**/*.xml", "./_src/**/*.txt"], ["build"]);
  gulp.watch(["./_src/assets/scss/**/*.scss"], ["styles"]);
  gulp.watch(["./_src/assets/js/**/*.js"], ["scripts"]);
});

// Default task
gulp.task("default", ["build", "watch"]);
