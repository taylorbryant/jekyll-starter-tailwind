const gulp = require('gulp');
const gutil = require('gulp-util');
const child = require('child_process');
const browserSync = require('browser-sync').create();

const siteRoot = '_site';
const mainCSS = 'src/style.css'; /* Main stylesheet (pre-build) */
const tailwindConfig = 'tailwind.js'; /* Tailwind config */

const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll'; /* Fix Windows compatibility issue */

/**
 * Build Jekyll Site
 */
gulp.task('jekyll-build', function () {
    browserSync.notify('Running: $ jekyll build');
    return child.spawn(jekyll, ['build'], {stdio: 'inherit'});
});

/**
 * Compile styles
 */
gulp.task('css', function () {
  const atimport = require('postcss-import');
  const postcss = require('gulp-postcss');
  const tailwindcss = require('tailwindcss');
  const autoprefixer = require('gulp-autoprefixer');
  const cleancss = require('gulp-clean-css');

  return gulp.src(mainCSS)
    .pipe(postcss([
      atimport(),
      tailwindcss(tailwindConfig)
    ]))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleancss())
    .pipe(gulp.dest('assets/css/'))
    .pipe(gulp.dest('_site/assets/css/'))
});

/**
 * Serve site with Browsersync
 */
gulp.task('serve', ['jekyll-build'], () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    open: "local",
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch([mainCSS, tailwindConfig], ['css']);
  gulp.watch(['**/*.html', '**/*.md', '**/*.yml', '!_site/**/*'], { interval: 500 }, ['jekyll-build']);
});

gulp.task('default', ['css', 'serve']);
