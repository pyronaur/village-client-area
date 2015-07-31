<?php


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