gulp = require("gulp")

gulp.task "build", ->
	gulp.start "coffee"
	gulp.start "sass"
