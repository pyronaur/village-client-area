<?php
/**
 * Plugin Name:       Village Client Area
 * Plugin URI:        http://themevillage.net
 * Description:       A client area plugin for Photographers. Requires Plugins: Advanced Custom Fields Pro and Redux Framework
 * Version:           1.1.5
 * Author:            ThemeVillage
 * Author URI:        http://themevillage.net
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       village-ca
 */


/**
 * @TODO:
 *
 *      * Add filterable JavaScript Options:
 *        + custom events when to trigger "layout" ?  ( for iScroll, AJAX, etc. )
 *      * Remove junk from classes
 */


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Deactivate client area post type plugin that was bundled with older ThemeVillage themes.
 * @since 1.0.0
 * @TODO  :
 *  + remove at v1.2.0
 */
if ( is_admin() ) {
	include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

	$legacy_vca_plugin = 'village-client-area-post-type/village-client-area-post-type.php';
	if ( is_plugin_active( $legacy_vca_plugin ) ) {
		deactivate_plugins( $legacy_vca_plugin );
	}
}

function village_client_area_initialize() {
	$domain = 'village-ca';
	// The "plugin_locale" filter is also used in load_plugin_textdomain()
	$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

	load_textdomain( $domain, WP_LANG_DIR . '/village-ca/' . $domain . '-' . $locale . '.mo' );
	load_plugin_textdomain( $domain, false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

add_action( 'plugins_loaded', 'village_client_area_initialize' );


require_once 'Village_Client_Area.php';


// Initialize
do_action( 'before_vca_init' );
VCA();
do_action( 'vca_init' );