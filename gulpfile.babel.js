import browserSync from "browser-sync";
import { spawn } from "child_process";
import gulp from "gulp";
import atimport from "postcss-import";
import autoprefixer from "gulp-autoprefixer";
import cleancss from "gulp-clean-css";
import postcss from "gulp-postcss";
import purgecss from "gulp-purgecss";
import tailwindcss from "tailwindcss";

const mainStylesheet = "src/style.css"; /* Main stylesheet (pre-build) */
const siteRoot = "_site";
const tailwindConfig = "tailwind.config.js"; /* Tailwind config */

/**
 * Fix Windows compatibility issue
 */
const jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";

/**
 * Build Jekyll Site
 */
const buildJekyll = () => {
  browserSync.notify("Building Jekyll site...");

  return spawn("bundle", ["exec", jekyll, "build"], { stdio: "inherit" });
};

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
const compileStyles = () => {
  browserSync.notify("Compiling CSS...");

  return gulp
    .src(mainStylesheet)
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
};

const buildSite = gulp.series(buildJekyll, compileStyles);

/**
 * Serve site with Browsersync
 */
const startServer = () => {
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
      mainStylesheet,
      tailwindConfig,
      "**/*.html",
      "**/*.md",
      "**/*.yml",
      "!_site/**/*",
      "!node_modules"
    ],
    { interval: 500 },
    buildSite
  );
};

const serve = gulp.series(buildSite, startServer);

export default serve;
