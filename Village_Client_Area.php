<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! class_exists( 'Village_Client_Area' ) ) :


	class Village_Client_Area {

		private static $config;

		public $version = '1.0.0';

		protected static $_instance = null;


		/**
		 * Main WooCommerce Instance
		 *
		 * Ensures only one instance of WooCommerce is loaded or can be loaded.
		 *
		 * @since 1.0.0
		 * @static
		 * @see   VCA()
		 * @return Village_Client_Area - Main instance
		 */
		public static function instance() {
			if ( is_null( self::$_instance ) ) {
				self::$_instance = new self();
			}

			return self::$_instance;
		}

		/**
		 * Cloning is forbidden.
		 * @since 1.0.0
		 */
		public function __clone() {
			_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'village' ), '1.0.0' );
		}
		/**
		 * Unserializing instances of this class is forbidden.
		 * @since 1.0.0
		 */
		public function __wakeup() {
			_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'village' ), '2.1' );
		}

		public function __construct () {

		}


		public static function conf( $key ) {
			if ( isset( self::$config[ $key ] ) ) {
				return self::$config[ $key ];
			} else {
				return false;
			}
		}


		/**
		 * Get the plugin url.
		 * @return string
		 */
		public function plugin_url() {
			return untrailingslashit( plugins_url( '/', __FILE__ ) );
		}

		/**
		 * Get the plugin path.
		 * @return string
		 */
		public function plugin_path() {
			return untrailingslashit( plugin_dir_path( __FILE__ ) );
		}

		/**
		 * Get the template path.
		 * @return string
		 */
		public function template_path() {
			return apply_filters( 'vca_template_path', 'client-area/' );
		}

	}

endif;

/**
 * Returns the main instance of Village Client Area to prevent the need to use globals.
 *
 * @since  1.0.0
 * @return Village_Client_Area
 */
if ( ! function_exists( 'VCA' ) ) {
	function VCA() {
		return Village_Client_Area::instance();
	}
}
