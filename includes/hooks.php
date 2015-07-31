<?php

/**
 * Add comments support for client_gallery
 */
if ( CA_Option::get( 'enable_comments', true ) ) {
	add_action( 'init', 'vca_add_comments_support' );
	function vca_add_comments_support() {
		add_post_type_support( 'client_gallery', 'comments' );
	}
}


/**
 * Remove "Protected:" from client_gallery posts
 */
add_filter( 'protected_title_format', 'ca_modify_protected_titles' );
function ca_modify_protected_titles( $title ) {
	if ( get_post_type() === 'client_gallery' ) {
		return '%s';
	}

	return $title;
}



/**
 * Turn image #hashtags into hoverable images
 */
if ( CA_Option::get( 'enable_smart_tags', true ) ) {
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

		return $matches[1] . '<span class="ca-preview-link">#' . $id . '</span>';

	}
}