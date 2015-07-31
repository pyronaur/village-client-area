<?php
/**
 * Plugin Name:       Village Client Area
 * Plugin URI:        http://themevillage.net
 * Description:       A client area plugin for Photographers. <br> Requires Plugins: Advanced Custom Fields Pro and Redux Framework
 * Version:           1.0.0
 * Author:            ThemeVillage
 * Author URI:        http://themevillage.net
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       village
 */



/**
 *
 *
 * @TODO:
 *
 *      * Add filterable JavaScript Options:
 *        + custom events when to trigger "layout" ?  ( for iScroll )
 *
 *      * Remove junk from classes
 *      * Publish to Wordpress.org or Github
 *
 * @DONE
 *
 *       * Avoid Naming collisions for Classes
 *      * Sensible naming for classes
 *       * DO NOT Combine Theme scripts into libs.js
 *          - Instead wp_enqueue_them as 'village-lib-' . $script_name;
 *          - Use same handles for masonry, jQache, etc.
 *      * Create Fallback Styles
 *      * Make PLUGIN work with Twenty Fifteen
 *      * Add "woocommerce like" body open / close action
 *      * Add image size for Client Gallery!
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


require_once 'Village_Client_Area.php';


// Initialize
do_action( 'before_vca_init' );
VCA();
do_action( 'vca_init' );