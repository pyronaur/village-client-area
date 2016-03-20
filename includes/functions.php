<?php

/**
 * Check if post_id belongs to the client-area plugin
 *
 * @param int $post_id
 *
 * @return bool
 */
function is_village_client_area( $post_id = 0 ) {

	$is_client_area = false;

	// If there is no post id, try to get_the_id()
	if( ! $post_id ) {
		$post_id        = get_the_ID();
	}
	// Try again, if still no ID
	if ( ! $post_id ) {
		$post_id = get_queried_object_id();
	}

	if (
		// Current post has correct post type
		'client_gallery' === get_post_type( $post_id )

		// Current page is set to be as the client area page
		|| ( CA_Option::get( 'client_area_page', false ) > 0 && CA_Option::get( 'client_area_page', 0 ) == $post_id )

		// Is client gallery archive
		|| is_post_type_archive( 'client_gallery' )
	) {
		$is_client_area = true;
	}

	return apply_filters( 'village_client_area/is_client_area', $is_client_area );
}

function vca_comments_template() {
	// If comments are open or we have at least one comment, load up the comment template
	if ( CA_Option::get( 'enable_comments', true ) && ( comments_open() || '0' != get_comments_number() ) ) {
		comments_template();
	}
}


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


if ( ! function_exists( 'village_is_password_protected' ) ) {

	function village_is_password_protected() {

		$post = get_post();

		/**
		 * Don't display password protected galleries in:
		 *    1. single-portfolio if post_password is required
		 *    2. If post has a password, doesn't matter whether the password was entered or not, don't display unless is_singular()
		 */
		if ( ( is_singular( array(
					'portfolio',
					'client_gallery'
				) ) && post_password_required() ) || ( ! is_singular( array(
					'portfolio',
					'client_gallery'
				) ) && ! empty( $post->post_password ) )
		) {
			return true;
		}


		/**
		 * Don't display if the current portfolio entry in any archive
		 */
		if ( ! is_singular( array( 'page', 'portfolio' ) )
		     && get_post_meta( get_the_ID(), 'remove_from_archive', true ) === "1"
		) {
			return true;
		}


		return false;

	}

}
