Config 			= GLOBAL.config
gulp 			= require('gulp')
coffee 			= require("gulp-coffee")
handle_errors 	= require('../util/handleErrors')
concat 			= require "gulp-concat"
wrap			= require "gulp-wrap"
merge 			= require "merge-stream"
sourcemaps 			= require "gulp-sourcemaps"
uglify 			= require 'gulp-uglifyjs'


js_wrapper = """

	(function() { 
	 	"use strict";
		var $, Hooks, App;
		$ = jQuery;
		App = {};
		Hooks = window.wp.hooks;
	    <%= contents %>
	}).call(this);

"""



get_source = ->
	files = gulp.src("#{Config.coffee.source}/**.coffee")
		.pipe( sourcemaps.init() )
		.pipe( coffee({
			join: true
			bare: false
		}).on("error", handle_errors) )
		



	return files



development = ->
	console.log "Build Coffee: Dev"
	

	source = get_source()
		.pipe( concat("client-area.js") )
		.pipe( wrap(js_wrapper).on( "error", handle_errors ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest(Config.build) )



production = ->
	console.log "Build Coffee: PRODUCTION"
	
	source = get_source()
		.pipe( concat("client-area.js") )
		.pipe( wrap(js_wrapper).on( "error", handle_errors ) )
		.pipe( uglify() )
		.pipe( gulp.dest(Config.build) )



if GLOBAL.production
	gulp.task("coffee", production)
else
	gulp.task("coffee", development)


