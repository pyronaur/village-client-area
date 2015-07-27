<?php

/**
 * Add comments support for client_gallery
 */
if ( VCA_Option::get( 'enable_comments', true ) ) {
	add_action( 'init', 'vca_add_comments_support' );
	function vca_add_comments_support() {
		add_post_type_support( 'client_gallery', 'comments' );
	}
}


/**
 * Turn image #hashtags into hoverable images
 */
if ( VCA_Option::get( 'enable_smart_tags', true ) ) {
	add_filter( 'comment_text', 'vca_image_link_markup' );
	add_filter( 'the_content', 'vca_image_link_markup' );

	function vca_image_link_markup( $content = '' ) {
		// Call Mr. Quits if not client area
		// Add markup to hashtags only on client area posts
		if ( 'client_gallery' !== get_post_type() ) {
			return $content;
		}

		$content = preg_replace_callback( '/(^|[.,>\s])#([\d]+)(?=$|[\s.,<])/', 'vca_image_link_markup_callback', $content );

		return $content;
	}

	function vca_image_link_markup_callback( $matches ) {

		$id = $matches[2];

		return $matches[1] . '<span class="vca-preview-link">#' . $id . '</span>';

	}
}