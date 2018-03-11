const browserSync = require("browser-sync").create();
const child = require("child_process");
const gulp = require("gulp");
const gutil = require("gulp-util");
const mainCSS = "src/style.css"; /* Main stylesheet (pre-build) */
const siteRoot = "_site";
const tailwindConfig = "tailwind.js"; /* Tailwind config */

/**
 * Fix Windows compatibility issue
 */
const jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";

/**
 * Build Jekyll Site
 */
gulp.task("jekyll-build", function() {
  browserSync.notify("Building Jekyll site...");
  
  return child.spawn(jekyll, ["build"], { stdio: "inherit" });
});

/**
 * Custom PurgeCSS Extractor
 * https://github.com/FullHuman/purgecss
 */
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g);
  }
}

/**
 * Compile CSS
 */
gulp.task("css", ["jekyll-build"], function() {
  const atimport = require("postcss-import");
  const autoprefixer = require("gulp-autoprefixer");
  const cleancss = require("gulp-clean-css");
  const postcss = require("gulp-postcss");
  const purgecss = require("gulp-purgecss");
  const tailwindcss = require("tailwindcss");

  browserSync.notify("Compiling CSS...");

  return gulp
    .src(mainCSS)
    .pipe(postcss([atimport(), tailwindcss(tailwindConfig)]))
    .pipe(
      purgecss({
        content: ["_site/**/*.html"],
        extractors: [
          {
            extractor: TailwindExtractor,
            extensions: ["html", "js"]
          }
        ]
      })
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(cleancss())
    .pipe(gulp.dest("assets/css/"))
    .pipe(gulp.dest("_site/assets/css/"));
});

/**
 * Serve site with Browsersync
 */
gulp.task("serve", ["css"], () => {
  browserSync.init({
    files: [siteRoot + "/**"],
    open: "local",
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(
    [
      mainCSS,
      tailwindConfig,
      "**/*.html",
      "**/*.md",
      "**/*.yml",
      "!_site/**/*",
      "!node_modules"
    ],
    { interval: 500 },
    ["css"]
  );
});

gulp.task("default", ["serve"]);
