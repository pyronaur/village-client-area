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
		bugReport: 'http://help.colormelon.com',
		lastTranslator: 'Colormelon <help@colormelon.com>',
		team: 'Colormelon <help@colormelon.com>',
	} ) )
	.pipe( gulp.dest( 'languages' ) )
