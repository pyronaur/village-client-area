<?php

/**
 *
 *
 * @TODO:
 *
 *      * Move Client Area to a Plugin
 *
 *      * Move colors & fonts to theme, keep layout settings
 *
 *      * Create Fallback Styles
 *
 *      * Make PLUGIN work with Twenty Fifteen
 *
 *      * Add "woocommerce like" body open / close action
 *
 *      * Publish to Wordpress.org or Github
 *
 * @DONE
 *       * DO NOT Combine Theme scripts into libs.js
 *          - Instead wp_enqueue_them as 'village-lib-' . $script_name;
 *          - Use same handles for masonry, jQache, etc.
 *
 */



/**
 * Enqueue scripts and styles.
 */
function vca_enqueue_styles_scripts() {
	$url_base = VCA()->plugin_url();

	/*!

	 * Enqueue Styles
	 *
	 */
	wp_enqueue_style( 'client-area-style', $url_base . '/assets/build/client-area.css' );



	/*!
	 *
	 * Enqueue Scripts
	 *
	 */
	// List of required JS Libs
	$libs = apply_filters( 'village_client_libs', array(
		'imagesloaded',
		'masonry',
		'wp_js_hooks',
		'jqache',
	) );

	 // Enqueue all required libraries
	foreach ( $libs as $lib_name ) {
		$handle = 'village-' . $lib_name;
		$url = $url_base . '/assets/libs/' . $lib_name . '.js';
		wp_enqueue_script( $handle, $url, array( 'jquery' ), VCA()->version, true );
	}


	// Enqueue Client Area Script
	wp_enqueue_script( 'village-client-area', $url_base . '/assets/build/client-area.js', array('jquery'), VCA()->version, true );


}

add_action( 'wp_enqueue_scripts', 'vca_enqueue_styles_scripts', 50 );
