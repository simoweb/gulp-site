var gulp = require('gulp');
// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
//img
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
//styles
var minifyCSS = require('gulp-minify-css');
var combineMq = require('gulp-combine-mq');

var gulpFilter = require('gulp-filter');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
var mainBowerFiles = require('main-bower-files');

var bowerDir = 'vendor/';

//path scss
var srcSass = 'assets/styles/*.scss';
var srcJs = 'assets/js/*.js';
//destination folder
var dest = 'assets/vendor/';


//estraggo i componenti js bower 
gulp.task('js', function() {
 	gulp.src(mainBowerFiles())
		.pipe(gulpFilter('*.js'))
		//.pipe(concat('test.js'))
		.pipe(gulp.dest(dest + 'js'));
 });

//estraggo i componenti css bower
gulp.task('bootstrap', function() {
 	gulp.src(bowerDir + 'bootstrap/dist/**/')
	.pipe(gulp.dest('./dist/bootstrap'));
 });


gulp.task('icons', function() {
 	gulp.src(bowerDir + 'fontawesome/fonts/**.*')
		.pipe(gulp.dest('./dist/fonts'));
 });


// Lint Task
gulp.task('lint', function() {
    return gulp.src(srcJs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(srcSass)
        .pipe(sass())
        .pipe(gulp.dest('assets/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(srcJs)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(srcJs, ['lint', 'scripts']);
    gulp.watch(srcSass, ['sass']);
});

//images min
gulp.task('comprimeImage', function () {
    return gulp.src('assets/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});


/*// merge media query
gulp.task('combineMq', function () {
    return gulp.src('assets/css/*')
    .pipe(combineMq({
        beautify: true
    }))
    .pipe(gulp.dest('dist/css'));
});*/

// CSS 
gulp.task('styles', function() {
	//main.css
	gulp.src(['./assets/css/main.css'])
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
	.pipe(gulp.dest('./dist/css/'));

	//main.css minify
	gulp.src(['./assets/css/main.css'])
	.pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
	.pipe(minifyCSS({keepBreaks:false}))
	.pipe(rename('main.min.css'))
	.pipe(gulp.dest('./dist/css/'));
	
	//bootstrap
	gulp.src(['./assets/css/bootstrap.css'])
	.pipe(gulp.dest('./dist/css/'));
	
	//bootstrap minify
	gulp.src(['./assets/css/bootstrap.css'])
	.pipe(minifyCSS({keepBreaks:false}))
	.pipe(rename('bootstrap.min.css'))
	.pipe(gulp.dest('./dist/css/'));
});
//css merge
//merge all file 
gulp.task('merge', function() {
	//all
	gulp.src(['./assets/css/bootstrap.css', './assets/css/main.css'])
	.pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
	.pipe(concat('all.css'))
	.pipe(gulp.dest('./dist/css/'));
	//minify all
	gulp.src(['./assets/css/bootstrap.css', './assets/css/main.css'])
	.pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
	.pipe(minifyCSS({keepBreaks:false}))
	.pipe(concat('all.min.css'))
	.pipe(gulp.dest('./dist/css/'));
});



// Default Task
gulp.task('default', ['lint', 'sass', 'scripts' ,'comprimeImage','styles','merge','js','bootstrap','icons']);