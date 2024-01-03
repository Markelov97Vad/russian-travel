const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();

/**
 * {build}
 * выполнение задачи по очереди:
 * -  очистка папки dist
 * - выполнение скриптов в параллельном режиме
 * 
 * {watchApp}
 * выполнение в парраллельном режиме build и watchFiles
 * cледит за файлами в src/ и делает пересборку после каждого изменения этих файлови, также перезагружает страницу в браузере
 */
const build = gulp.series(clean, gulp.parallel(html, css, images));
const watchapp = gulp.parallel(build, watchFiles, serve);

function html() {
  return gulp.src('src/**/*.html') // откуда брать HTML-файлы.
        .pipe(plumber()) // Чтобы избежать ошибок при сборке
        .pipe((gulp.dest('dist/'))) // точка назначения
        .pipe(browserSync.reload({stream: true})) // перезагрузка браузера при выполнении каждой команды
}
      
function css() {
  return gulp.src('src/blocks/**/*.css')
        .pipe(plumber())
        .pipe(concat('index.css')) // объединение css в один файл
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}))
}

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({stream: true}))
}

function clean() { // очистка паки dist
  return del('dist');
}

function watchFiles() { // отслеживание изменения в файлах
  gulp.watch(['src/**/*.html',], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
}

function serve() { // 
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
}

exports.css = css; // для вызыва функции в командной строке
exports.images = images; 
exports.html = html;
exports.clean = clean;
exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;