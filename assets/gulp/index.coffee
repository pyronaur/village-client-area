fs 				= require("fs")
onlyScripts 	= require("./util/scriptFilter")
tasks 			= fs.readdirSync("./assets/gulp/tasks/").filter(onlyScripts)

tasks.forEach (task) ->
	require "./tasks/" + task
	return

