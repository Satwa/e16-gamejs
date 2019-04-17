const gulp = require('gulp')
const sass = require('gulp-sass')
const minify = require('gulp-minify')
const concat = require('gulp-concat')
const handler = require('serve-handler')
const http = require('http')

gulp.task('sass', function () {
    return gulp.src('src/sass/app.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('dist/styles'))
})

gulp.task('js', function () {
    return gulp.src(['src/scripts/class/Entity.js', 'src/scripts/class/*.js', "src/scripts/app.js"])
        .pipe(concat('app.js')) // https://www.npmjs.com/package/gulp-concat
        .pipe(minify({
            ext: {
                min: '.js',
                src: '.debug.js'
            },
            noSource: true
        }).on('error', sass.logError))
        .pipe(gulp.dest('dist/scripts'))
})

gulp.task('res', function(){
    return gulp.src(['src/res/**/*', 'src/res/**/**/*'])
        .pipe(gulp.dest('dist/res'))
})


gulp.task("watch", gulp.series('sass', 'js', 'res', function () {
    gulp.watch(['src/sass/*.scss', 'src/sass/**/*.scss'], gulp.series('sass'))
    gulp.watch(['src/scripts/*.js', 'src/scripts/**/*.js'], gulp.series('js'))
    gulp.watch(['src/res/**/*.*', 'src/res/**/**/*.*'], gulp.series('res'))


    const server = http.createServer((request, response) => {
        return handler(request, response, {
            cleanUrls: false
        })
    })

    server.listen(5001, () => {
        console.log('Running at http://localhost:5001')
    })
}))
