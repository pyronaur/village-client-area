gulp = require('gulp')
wpPot = require('gulp-wp-pot')
sort = require('gulp-sort')

gulp.task "pot", ->
	gulp.src( '**/*.php' )
	.pipe( sort() )
	.pipe( wpPot( {
		package: 'Village Client Area',
		domain: 'village-ca',
		destFile: 'village-client-area.pot',
		bugReport: 'http://help.themevillage.net',
		lastTranslator: 'ThemeVillage <help@themevillage.net>',
		team: 'ThemeVillage <help@themevillage.net>',
	} ) )
	.pipe( gulp.dest( 'languages' ) )
