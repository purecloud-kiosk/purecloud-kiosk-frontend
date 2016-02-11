var gulp = require("gulp");
var cssnano = require("gulp-cssnano");
var minifyJs = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");

var watch;

var paths = {
    styles: "less/**/*.*",
    images: "img/**/*.*",
    bower_fonts: "bower_components/**/*.{ttf,woff,eof,svg}"
};

gulp.task("copy-bower_fonts", function() {
    return gulp.src(paths.bower_fonts)
        .pipe(rename({
            dirname: "/fonts"
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task("custom-images", function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest("dist/img"));
});


gulp.task("lib-css", function(){
  var files = [
    "bower_components/bootstrap/dist/css/bootstrap.min.css",
    "bower_components/font-awesome/css/font-awesome.min.css",
    "bower_components/rdash-ui/dist/css/rdash.min.css",
    "bower_components/odometer/themes/odometer-theme-default.css",
    "node_modules/react-date-picker/base.css",
    "node_modules/react-date-picker/theme/default.css",
    //"node_modules/react-popup/examples/popup.example.css"
    //"node_modules/react-time-picker/"
  ];
  return gulp.src(files)
    .pipe(cssnano())
    .pipe(concat("lib.min.css"))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("lib-js", function(){
  var files = [
    "jsx/cleanUrl.js",
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/bootstrap/dist/js/bootstrap.min.js",
    "bower_components/odometer/odometer.min.js"
  ];
  return gulp.src(files)
    .pipe(minifyJs())
    .pipe(concat("lib.min.js"))
    .pipe(gulp.dest("dist/js"));
});

// handle file watching

gulp.task("build", ["custom-images", "lib-css", "lib-js", "copy-bower_fonts"]);
gulp.task("default", ["build"]);
