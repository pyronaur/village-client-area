<?php
/**
 *
 * @link              http://themevillage.net
 * @since             1.0.0
 * @package           Village_Client_Area
 *
 * @wordpress-plugin
 * Plugin Name:       Village Client Area
 * Plugin URI:        http://themevillage.net
 * Description:       A client area plugin for Photographers. <br> Requires Plugins: Advanced Custom Fields Pro; Redux Framework;
 * Version:           1.0.0
 * Author:            ThemeVillage
 * Author URI:        http://themevillage.net
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       village
 */

if( ! defined('ABSPATH') ) exit;


/**
 * Deactivate client area post type plugin that was bundled with older ThemeVillage themes.
 * @since 1.0.0
 * @TODO:
 *  + remove at v1.2.0
 */
if( is_admin() ) {
	include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

	$legacy_vca_plugin = 'village-client-area-post-type/village-client-area-post-type.php';
	if ( is_plugin_active( $legacy_vca_plugin ) ) {
		deactivate_plugins( $legacy_vca_plugin );
	}
}

require_once 'Village_Client_Area.php';
require_once 'core/register_post_type.php';
require_once 'core/class-vca-option.php';

require_once 'includes/functions.php';
require_once 'includes/hooks.php';
require_once 'includes/ajax.php';
require_once 'includes/enqueue.php';



if( class_exists( 'ReduxFramework') && class_exists('Village_Options') ) {
	require_once( 'includes/options.php' );
}


