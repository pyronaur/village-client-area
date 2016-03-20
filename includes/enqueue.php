<?php

/**
 * Enqueue scripts and styles.
 */
function vca_enqueue_styles_scripts() {

	/**
	 * Only load styles and scripts when necessary.
	 * Don't bloat front-end.
	 */
	if ( false === apply_filters( 'village_client_area/load_scripts', is_village_client_area() ) ) {
		return;
	}

	$url_base = VCA()->plugin_url();

	/*!

	 * Enqueue Styles
	 *
	 */
	wp_enqueue_style( 'client-area-style', $url_base . '/resources/build/client-area.css' );


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
		'velocity',
	) );

	// Enqueue all required libraries
	foreach ( $libs as $lib_name ) {
		$handle = 'village-' . $lib_name;
		$url    = $url_base . '/resources/libs/' . $lib_name . '.js';
		wp_enqueue_script( $handle, $url, array( 'jquery', 'underscore' ), VCA()->version, true );
	}


	// Enqueue Client Area Script
	wp_enqueue_script( 'village-client-area', $url_base . '/resources/build/client-area.js', array( 'jquery' ), VCA()->version, true );

	// Add "window.ajax_object.ajax_url" to frontend
	wp_localize_script( 'village-client-area', 'ajax_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );

}

add_action( 'wp_enqueue_scripts', 'vca_enqueue_styles_scripts', 20 );
