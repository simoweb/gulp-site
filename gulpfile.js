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
var cmq = require('gulp-combine-media-queries');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
var minifyCSS = require('gulp-minify-css');
var postcss = require('gulp-postcss');
var filter = require('gulp-filter');
var cssbeautify = require('gulp-cssbeautify');
var mainBowerFiles = require('main-bower-files');


/******************************
//path
******************************/
var srcSass = 'assets/styles/';
var srcJs = 'assets/js/*.js';
//destination folder
var dest = 'assets/vendor/';
var bowerDir = 'bower_components/';


/******************************
//main
******************************/
// Compile Our Sass
gulp.task('styles', function() {
	//nested
	gulp.src(srcSass+'main.scss')
    .pipe(sass())
	.pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
	.pipe(cmq({
      log: true
    }))
	.pipe(cssbeautify({
            indent: '  ',
            openbrace: 'end-of-line',
            autosemicolon: false
        }))
    .pipe(gulp.dest('dist/css'));
    //minify
	gulp.src(srcSass+'main.scss')
    .pipe(sass())
	.pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
	.pipe(minifyCSS({keepBreaks:false}))
	.pipe(rename('main.min.css'))
    .pipe(gulp.dest('dist/css'));
});

/******************************
//images min
******************************/
gulp.task('comprimeImage', function () {
    return gulp.src('assets/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});


/******************************
//script complie and minify
******************************/
gulp.task('scripts', function() {
    return gulp.src(srcJs)
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

/******************************
//link task
******************************/
gulp.task('lint', function() {
    return gulp.src(srcJs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/******************************
//wach for change
******************************/
gulp.task('watch', function() {
    gulp.watch(srcJs, ['lint', 'scripts']);
    gulp.watch(srcSass, ['sass']);
});


/******************************
//components from bower
******************************/
gulp.task('libs', function() {

	var jsFilter = filter(['*.js','!doc-ready.js','!EventEmitter.js','!eventie.js','!get-size.js','!get-style-property.js','!item.js','!matches-selector.js','!outlayer.js']);
    var cssFilter = filter('*.css');
    var fontFilter = filter(['*.eot', '*.woff', '*.svg', '*.ttf']);

	return gulp.src(mainBowerFiles())

	// grab vendor js files from bower_components, minify and push in /dist
	.pipe(jsFilter)
	//.pipe(gulp.dest('./dist/js/'))
	.pipe(uglify())
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest('./dist/js/'))
	.pipe(jsFilter.restore())

	// grab vendor css files from bower_components, minify and push in /dist
	.pipe(cssFilter)
	//.pipe(gulp.dest('./dist/css'))
	.pipe(minifyCSS())
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest('./dist/css'))
	.pipe(cssFilter.restore())

	// grab vendor font files from bower_components and push in /public 
	.pipe(fontFilter)
	//.pipe($flatten())
	.pipe(gulp.dest('./dist/fonts'))
});

/******************************
//compile html
******************************/

var inject = require('gulp-inject');

gulp.task('index', function () {
  gulp.src('./dist/*.html')
  .pipe(inject(gulp.src(['./dist/**/*.js', './dist/**/*.css'], {read: false}), {relative: true}))
  .pipe(gulp.dest('./dist'));
});




// Default Task
gulp.task('default', ['styles','comprimeImage','scripts','lint','libs','index']);