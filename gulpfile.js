const gulp = require('gulp')
const sass = require('gulp-sass')
const minify = require('gulp-minify')
const handler = require('serve-handler')
const http = require('http')

gulp.task('sass', function () {
    return gulp.src('src/sass/app.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('dist/styles/app.css'))
})

gulp.task('js', function () {
    return gulp.src('src/scripts/app.js')
        .pipe(minify().on('error', sass.logError))
        .pipe(gulp.dest('dist/scripts/app.js'))
})


gulp.task("watch", function () {
    gulp.watch(['src/sass/*.scss', 'src/sass/**/*.scss'], gulp.series('sass'))

    const server = http.createServer((request, response) => {
        return handler(request, response)
    })

    server.listen(5000, () => {
        console.log('Running at http://localhost:5000')
    })
})
