sass = require("gulp-ruby-sass")
gulp = require("gulp")
notify = require("gulp-notify")
error_handle = require("../util/handleErrors")
autoprefixer = require "gulp-autoprefixer"
maps = require "gulp-sourcemaps"
cssmin = require 'gulp-minify-css'
Config = GLOBAL.config



development = ->
	sass("#{Config.sass.source}/client-area.sass", {
		precision: 3
		style: 'expanded'
		sourcemap: true
	})
	.pipe autoprefixer()
	.pipe maps.write()
	.pipe gulp.dest(Config.build)


production = ->

		cssmin_opts =
			rebase: false
			keepSpecialComments: 0
			advanced: false


		sass("#{Config.sass.source}/client-area.sass", {
			precision: 3
			style: 'expanded'
			sourcemap: false
		})
		.pipe autoprefixer()
		.pipe cssmin( cssmin_opts )
		.pipe gulp.dest(Config.build)

if GLOBAL.production
	gulp.task "sass", production
else
	gulp.task "sass", development


