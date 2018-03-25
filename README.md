# Tailwind Jekyll Starter
A starter kit for using [Tailwind](https://tailwindcss.com) (v0.5.1) with [Jekyll](https://jekyllrb.com/) that includes:
* A barebones Jekyll starter theme
* A Gulp file with a default task that does the following:

    * Builds Tailwind
    * Strips out unused CSS using [Purgecss](http://www.purgecss.com/)
    * Runs [Autoprefixer](https://github.com/postcss/autoprefixer)
    * Minifies your CSS
    * Builds Jekyll
    * Runs [Browsersync](https://www.browsersync.io/) for live reload

## What is Tailwind?
>"Tailwind is a utility-first CSS framework for rapidly building custom user interfaces."
– [Tailwind](https://tailwindcss.com)

## What is Jekyll?
>"Jekyll is a simple, blog-aware, static site generator perfect for personal, project, or organization sites. Think of it like a file-based CMS, without all the complexity. Jekyll takes your content, renders Markdown and Liquid templates, and spits out a complete, static website ready to be served by Apache, Nginx or another web server. Jekyll is the engine behind GitHub Pages, which you can use to host sites right from your GitHub repositories."
– [Jekyll](https://jekyllrb.com/)

## Requirements 
* [Bundler](http://bundler.io/)
* [gulp-cli](https://www.npmjs.com/package/gulp-cli)
* [Jekyll](https://jekyllrb.com/)
* [Node.js](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)
* [Ruby](https://www.ruby-lang.org/en/)

## Getting started
* `bundle install` to install Ruby gems
* `npm install` to install npm packages
* `gulp` to run the default Gulp task

Need your CSS in the `<head>`? Check out the [internal style version](https://github.com/taylorbryant/tailwind-jekyll-internal) of this starter kit.

## License
[MIT](https://github.com/taylorbryant/tailwind-jekyll/blob/master/LICENSE.md)
