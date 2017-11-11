const gulp = require('gulp');
const gutil = require('gulp-util');
const child = require('child_process');
const browserSync = require('browser-sync').create();
const siteRoot = '_site';
const cssFiles = 'src/style.css';

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['serve',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('css', function () {
  const atimport = require('postcss-import');
  const postcss = require('gulp-postcss');
  const tailwindcss = require('tailwindcss');
  const autoprefixer = require('gulp-autoprefixer');
  const cleancss = require('gulp-clean-css');

  return gulp.src('src/style.css')
    .pipe(postcss([
      atimport(),
      tailwindcss('tailwind-config.js')
    ]))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleancss())
    .pipe(gulp.dest('assets/css/'));
});


gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(cssFiles);
});

gulp.task('default', ['css', 'jekyll', 'serve']);