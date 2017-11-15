const gulp = require('gulp');
const gutil = require('gulp-util');
const child = require('child_process');
const browserSync = require('browser-sync').create();
const siteRoot = '_site';
const cssFiles = 'src/style.css';
const tailwindConfig = 'tailwind-config.js';

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify('Running: $ jekyll build');
    return child.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
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

  return gulp.src(cssFiles)
    .pipe(postcss([
      atimport(),
      tailwindcss(tailwindConfig)
    ]))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleancss())
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('assets/css/'));
});

/**
 * Serve site with browserSync
 */
gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch([cssFiles, tailwindConfig], ['css']);
  gulp.watch(['**/*.html', '**/*.yml', '!_site/**/*'], ['jekyll-rebuild']);
});

gulp.task('default', ['css', 'serve']);
