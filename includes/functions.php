<?php


function vca_comments_template() {
	// If comments are open or we have at least one comment, load up the comment template
	if ( VCA_Option::get( 'enable_comments', true ) && ( comments_open() || '0' != get_comments_number() ) ) {

		comments_template( 'client-area/comments.php' );

		comments_template( vca_locate_template( 'single/comments' ) );
	}
}

function vca_filter_comments_template( $path ) {

	# Filter only client-area comments template
	if ( ! strpos( $path, 'client-area' ) ) {
		return $path;
	}

	$comments_location = '/client-area/comments.php';

	if ( ! file_exists( STYLESHEETPATH . $comments_location )
	     && ! file_exists( TEMPLATEPATH . $comments_location )
	) {
		$new_path = VCA()->plugin_path() . "/templates/single/comments.php";

		if ( file_exists($new_path ) ) {
			return $new_path;
		}
	}

	return $path;

}

add_filter( 'comments_template', 'vca_filter_comments_template' );


function vca_get_template_part( $slug, $name = null, $load = true ) {

	$template = vca_locate_template( $slug, $name );

	// Allow 3rd party plugin filter template file from their plugin
	if ( $template ) {
		$template = apply_filters( 'vca_get_template_part', $template, $slug, $name );
	}

	if ( $template ) {

		if ( $load ) {
			load_template( $template, false );
		} else {
			return $template;
		}

	}


}

function vca_locate_template( $slug, $name = null ) {
	$template = "";

	// Look in yourtheme/slug-name.php and yourtheme/client-area/slug-name.php
	if ( $name ) {
		$template = locate_template( array( "{$slug}-{$name}.php", VCA()->template_path() . "{$slug}-{$name}.php" ) );
	}

	// Get plugin path slug-name.php
	if ( ! $template && $name && file_exists( VCA()->plugin_path() . "/templates/{$slug}-{$name}.php" ) ) {
		$template = VCA()->plugin_path() . "/templates/{$slug}-{$name}.php";
	}

	// If template file doesn't exist, look in yourtheme/slug.php and yourtheme/woocommerce/slug.php
	if ( ! $template ) {
		$template = locate_template( array( "{$slug}.php", VCA()->template_path() . "{$slug}.php" ) );
	}

	// Get fallback slug.php
	if ( ! $template && ! $name && file_exists( VCA()->plugin_path() . "/templates/{$slug}.php" ) ) {
		$template = VCA()->plugin_path() . "/templates/{$slug}.php";
	}

	return $template;
}