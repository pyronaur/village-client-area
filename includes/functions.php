<?php


function vca_comments_template() {
	// If comments are open or we have at least one comment, load up the comment template
	if ( VCA::get_option('enable_comments', true) && ( comments_open() || '0' != get_comments_number() ) ) {
		comments_template( '/' . vca_get_template_part( 'single/comments', null, false ) );
	}
}

function vca_get_template_part( $slug, $name = null, $locate = true ) {

	$base = VCA::conf( 'templates' );

	$templates = array();
	$name      = (string) $name;
	if ( '' !== $name ) {
		$templates[] = "{$base}{$slug}-{$name}.php";
	}

	$templates[] = "{$base}{$slug}.php";

	if ( $locate ) {
		return vca_locate_template( $templates, true, false );
	} else {
		return end( $templates );
	}


}

function vca_locate_template( $template_names, $load = false, $require_once = true ) {
	$located = '';

	foreach ( (array) $template_names as $template_name ) {
		if ( ! $template_name ) {
			continue;
		}
		if ( file_exists( STYLESHEETPATH . '/' . $template_name ) ) {
			$located = STYLESHEETPATH . '/' . $template_name;
			break;
		} elseif ( file_exists( TEMPLATEPATH . '/' . $template_name ) ) {
			$located = TEMPLATEPATH . '/' . $template_name;
			break;
		}
	}


	if ( $load && '' != $located ) {
		load_template( $located, $require_once );
	}


	return $located;
}