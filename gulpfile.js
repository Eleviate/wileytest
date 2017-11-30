let gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    rigger = require('gulp-rigger'),
    mkdirp = require('mkdirp'),
    sass = require('gulp-sass'),
    rimraf = require('rimraf'),
    watch = require('gulp-watch');

mkdirp('/public', function (err) {
    if (err) console.error(err);
    else console.log('Directory "/public" successfully created');
});


let path = {
    build: {
        html: 'public/',
        js: 'public/js/',
        css: 'public/style/'
    },
    src: {
        html: 'app/**/*.html',
        js: 'app/js/main.js',
        style: 'app/styles/main.scss'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/styles/**/*.scss'
    },
    clean: './public'
};

gulp.task('js', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('style', function () {
    gulp.src(path.src.style)
        .pipe(sass())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('webserver', function () {
    browserSync({
        server: {
            baseDir: "./public"
        },
        tunnel: true,
        host: 'localhost',
        port: 3000,
        logPrefix: "app"
    });
});

gulp.task('watch', function() {
    watch([path.watch.html], function () {
        gulp.start('html');
    });
    watch([path.watch.style], function () {
        gulp.start('style');
    });
    watch([path.watch.js], function () {
        gulp.start('js');
    });
});

gulp.task('build', [
    'js',
    'html',
    'style'
]);

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);
