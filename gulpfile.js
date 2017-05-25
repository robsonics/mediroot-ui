var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    fileinclude = require('gulp-file-include');

// Styles
gulp.task('styles', function() {
  return sass('scss/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Vendor Styles
gulp.task('vendor-styles', function() {
  return gulp.src([	'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
			'app/bower_components/fullcalendar/dist/fullcalendar.css',
			'app/bower_components/metisMenu/dist/metisMenu.min.css',
			'app/dist/css/sb-admin-2.css',
			'app/dist/css/angucomplete-alt.css',
			'app/bower_components/font-awesome/css/font-awesome.min.css',
			'app/node_modules/ng-dialog/css/ngDialog.min.css',
			'app/node_modules/ng-dialog/css/ngDialog-theme-default.min.css',
			'app/node_modules/ng-dialog/css/ngDialog-theme-plain.min.css'])
    .pipe(concat('vendor-main.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Vendor styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src([	'app/scripts/app.js',
			'app/modules/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('vendor-script', function(){
  return gulp.src([	'app/bower_components/jquery/dist/jquery.min.js',
			'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
			'app/bower_components/metisMenu/dist/metisMenu.min.js',
			'app/dist/js/sb-admin-2.js',
			'app/node_modules/angular/angular.js',
			'app/dist/js/angular-animate.js',
			'app/node_modules/angular-route/angular-route.js',
			'app/node_modules/angular-cookies/angular-cookies.min.js',
			'app/node_modules/ng-dialog/js/ngDialog.min.js',
			'app/dist/js/angucomplete-alt.js',
			'app/dist/js/angular-file-upload.min.js',
			'app/dist/js/ui-bootstrap-tpls-0.14.3.js',
			'app/bower_components/moment/moment.js',
			'app/bower_components/fullcalendar/dist/fullcalendar.js',
			'app/bower_components/fullcalendar/dist/lang/pl.js',
			'app/bower_components/fullcalendar/dist/gcal.js',
			'app/dist/js/calendar.js',
			'app/dist/js/angular-touch.min.js',
			'app/node_modules/ag-grid/dist/ag-grid.js',
			'app/lib/easeljs-NEXT.combined.js',
			'app/lib/signature_pad.min.js',
			'app/lib/signature.js'])
//    .pipe(console.log)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Vendor scripts task complete' }));
});

// minify html
gulp.task('minify' , function() {
  return gulp.src([	'app/index.html',
			'app/index2.html',
			'app/menu.html',
			'app/login.html',
			'app/modules/**/*.html',])
    //.pipe(console.log)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
    .pipe(notify({message: 'Minification html complete'}));
});

// Images
gulp.task('images', function() {
  return gulp.src('img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/styles', 'dist/js', 'dist/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('vendor-styles', 'scripts', 'vendor-script', 'minify', 'images');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('img/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});
