var gulp = require('gulp');
var Flixir = require('../index');

var $ = Flixir.Plugins;
var config = Flixir.config;


/*
 |----------------------------------------------------------------
 | CSS File Concatenation
 |----------------------------------------------------------------
 |
 | This task will concatenate and minify your style sheet files
 | in order, which provides a quick and simple way to reduce
 | the number of HTTP requests your application fires off.
 |
 */

Flixir.extend('styles', function(styles, output, baseDir) {
    var paths = prepGulpPaths(styles, baseDir, output);

    new Flixir.Task('styles', function() {
        return gulpTask.call(this, paths);
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});


Flixir.extend('stylesIn', function(baseDir, output) {
    var paths = prepGulpPaths('**/*.css', baseDir, output);

    new Flixir.Task('stylesIn', function() {
        return gulpTask.call(this, paths);
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});


/**
 * Trigger the Gulp task logic.
 *
 * @param {object} paths
 */
var gulpTask = function(paths) {
    this.log(paths.src, paths.output);

    return (
        gulp
        .src(paths.src.path)
        .pipe($.if(config.sourcemaps, $.sourcemaps.init()))
        .pipe($.concat(paths.output.name))
        .pipe($.if(config.production, $.cssnano(config.css.cssnano.pluginOptions)))
        .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest(paths.output.baseDir))
        .pipe(new Flixir.Notification('Stylesheets Merged!'))
    );
};


/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|array} src
 * @param  {string|null}  output
 * @return {object}
 */
var prepGulpPaths = function(src, baseDir, output) {
    return new Flixir.GulpPaths()
        .src(src, baseDir || config.get('assets.css.folder'))
        .output(output || config.get('public.css.outputFolder'), 'all.css');
};
