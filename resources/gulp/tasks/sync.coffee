gulp = require("gulp")
sync = require("browser-sync")
Config = GLOBAL.config
watch = require "gulp-watch"
util = require 'gulp-util'


gulp.task "browser-sync", ->
	sync.init "resources/build/*.css",
		proxy:
			target: Config.url
		open: false
		port: 3002


gulp.task "sync", ["browser-sync"], ->

	watch "#{Config.coffee.source}/**", ->
		gulp.start "coffee"

	watch "#{Config.sass.source}/**", ->
		gulp.start "sass"

	watch "**/*.php", ->
		util.log "[PHP] " + util.colors.yellow("Clear Cache")
		setTimeout( sync.reload, 200 )

	watch "#{Config.build}/*.js", ->
		sync.reload()

	watch "#{Config.build}/*.js", ->
		sync.reload()
	
