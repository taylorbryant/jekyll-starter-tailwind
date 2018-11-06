import { dest, series, src, task, watch } from "gulp";

import atimport from "postcss-import";
import autoprefixer from "autoprefixer";
import browserSync from "browser-sync";
import cssnano from "cssnano";
import gulpif from "gulp-if";
import postcss from "gulp-postcss";
import purgecss from "gulp-purgecss";
import sourcemaps from "gulp-sourcemaps"
import { spawn } from "child_process";
import tailwindcss from "tailwindcss";

/**
 * General settings
 */

const mainStylesheet = "src/style.css"; /* Main stylesheet (pre-build) */
const siteRoot = "_site";
const tailwindConfig = "tailwind.config.js"; /* Tailwind config */
const cssDest = "_site/assets/css/";
let devBuild = false;

/**
 * Utilities
 */

// Flag dev/production builds
const setDevBuild = async () => { devBuild = true; }

// Fix for Windows compatibility
const jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";

// Custom PurgeCSS Extractor
// https://github.com/FullHuman/purgecss
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || [];
  }
}

/**
 * Jekyll tasks
 */

task('buildJekyll', () => {
  browserSync.notify("Building Jekyll site...");
  const args = ["exec", jekyll, "build"];

  if (devBuild) { args.push("--incremental"); }

  return spawn("bundle", args, { stdio: "inherit" });
});

/**
 * CSS tasks
 */

task('processCss', (done) => {
  browserSync.notify('Compiling tailwind');
  return src(mainStylesheet)
    .pipe(postcss([atimport(), tailwindcss(tailwindConfig)]))
    .pipe(gulpif(devBuild, sourcemaps.init()))
    .pipe(gulpif(!devBuild, new purgecss({
      content: ["_site/**/*.html"],
      extractors: [{
        extractor: TailwindExtractor,
        extensions: ["html", "js"]
      }]
    })))
    .pipe(gulpif(!devBuild, postcss([autoprefixer(), cssnano()])))
    .pipe(gulpif(devBuild, sourcemaps.write('')))
    .pipe(dest(cssDest));
})

/**
 * Browsersync tasks
 */

task('startServer', () => {
  browserSync.init({
    files: [siteRoot + "/**"],
    open: "local",
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  watch(
    [
      mainStylesheet,
      tailwindConfig,
      "**/*.html",
      "**/*.md",
      "**/*.yml",
      "!_site/**/*",
      "!node_modules"
    ], { interval: 500 },
    buildSite
  );
});

/**
 * Exports
 */

const buildSite = series('buildJekyll', 'processCss');

exports.serve = series(setDevBuild, buildSite, 'startServer');
exports.build_dev = series(setDevBuild, buildSite);
exports.default = series(buildSite);
