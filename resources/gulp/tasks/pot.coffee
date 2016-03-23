gulp = require('gulp')
wpPot = require('gulp-wp-pot')
sort = require('gulp-sort')

gulp.task "pot", ->
	gulp.src( '**/*.php' )
	.pipe( sort() )
	.pipe( wpPot( {

		domain: 'village-client',
		destFile: 'village-client.pot',
		package: 'village',
		bugReport: 'http://help.themevillage.net',
		lastTranslator: 'ThemeVillage <help@themevillage.net>',
		team: 'ThemeVillage <help@themevillage.net>',
	} ) )
	.pipe( gulp.dest( 'languages' ) )
