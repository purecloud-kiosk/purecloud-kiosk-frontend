var gulp = require("gulp");
var cssnano = require("gulp-cssnano");
var watchify = require("watchify");
var minifyJs = require("gulp-uglify");
var less = require("gulp-less");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");

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

gulp.task("compile-less", function() {
    var lessCompiler = less();
    lessCompiler.on("error", function(){
      console.log("error compiling less");
      lessCompiler.end();
    });
    return gulp.src(paths.styles)
        .pipe(lessCompiler)
        .pipe(cssnano())
        .pipe(concat("dashboard.min.css"))
        .pipe(gulp.dest("dist/css"));
});

gulp.task("lib-css", function(){
  var files = [
    "bower_components/bootstrap/dist/css/bootstrap.min.css",
    "bower_components/font-awesome/css/font-awesome.min.css",
    "bower_components/rdash-ui/dist/css/rdash.min.css",
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
    "bower_components/bootstrap/dist/js/bootstrap.min.js"
  ];
  return gulp.src(files)
    .pipe(minifyJs())
    .pipe(concat("lib.min.js"))
    .pipe(gulp.dest("dist/js"));
});

// handle file watching

gulp.task("browserify-watch", function(){
  watch = true;
  return browserifyApp();
});

gulp.task("browserify-no-watch", function(){
  watch = false;
  return browserifyApp().once("end", function(){
    console.log("bundle created");
    process.exit();
  });
})

function browserifyApp(){
  var options = {
    entries : "./jsx/index.jsx",
    extensions : [".jsx"]
  }
  var b;
  if(watch){
    options.cache = {};
    options.packageCache = {};
    options.plugin = [watchify];
    b = browserify(options);
    b = watchify(b);
    bundle(b);
    b.on("update", function(){
      console.log("rebundling...");
      bundle(b);
    });
    b.on("log", function(msg){
      console.log("bundle created");
      console.log(msg);
    });
  }
  else{
    b = browserify(options);
    return bundle(b);
  }
}
function bundle(b){
  return b.transform(babelify, {presets : ["es2015", "react"]})
    .bundle()
    .pipe(source("bundle.min.js"))
    .pipe(buffer())
    .pipe(minifyJs())
    .pipe(gulp.dest("dist/js"));
}

gulp.task("compile-external", ["custom-images", "lib-css", "lib-js", "copy-bower_fonts"]);
gulp.task("build", ["compile-external", "compile-less", "browserify-no-watch"]);
gulp.task("watch", ["compile-external", "compile-less", "browserify-watch"], function(){
  gulp.watch(paths.styles, ["compile-less"]);
});
gulp.task("default", ["build"]);
