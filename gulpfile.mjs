import gulp from 'gulp';
import sass from 'gulp-sass';
import dartSass from 'sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import cleanCSS from 'gulp-clean-css';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';


const bs = browserSync.create();
const sassCompiler = sass(dartSass);

const paths = {
  html: 'src/**/*.html',
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  img: 'src/assets/images/**/*',
  fonts: 'src/fonts/**/*',
  dist: 'dist/'
};

const clean = () => deleteAsync([paths.dist]);

const html = () =>
  gulp.src(paths.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.dist))
    .pipe(bs.stream());

const styles = () =>
  gulp.src(paths.scss)
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(postcss([tailwindcss, autoprefixer]))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(bs.stream());

const scripts = () =>
  gulp.src(paths.js)
    .pipe(terser())
    .pipe(gulp.dest(paths.dist + 'js'))
    .pipe(bs.stream());

const images = () =>
  gulp.src(paths.img)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + 'assets/images'));

const fonts = () =>
  gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dist + 'fonts'));

const serve = () => {
  bs.init({ server: { baseDir: paths.dist } });
  gulp.watch(paths.html, html);
  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.img, images);
  gulp.watch(paths.fonts, fonts);  // Следим за изменениями в шрифтах
};

export const build = gulp.series(clean, gulp.parallel(html, styles, scripts, images, fonts));
export const dev = gulp.series(build, serve);