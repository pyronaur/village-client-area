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


		/**
		 * Constructor
		 */
		public function __construct() {

			$this->includes();


		}


		/**
		 * Include necessary files
		 */
		public function includes() {

			require_once 'includes/register_post_type.php';

			require_once 'core/Village_Options.class.php';
			require_once 'core/VCA_Option.class.php';
			require_once 'core/VCA_Template_Loader.class.php';
			require_once 'core/Village_Client_Gallery_Data.class.php';
			require_once 'core/Village_Render.class.php';

			require_once 'includes/functions.php';
			require_once 'includes/hooks.php';
			require_once 'includes/ajax.php';
			require_once 'includes/enqueue.php';

			if ( function_exists( 'acf_add_local_field_group' ) ) {
				require_once 'includes/advanced-custom-fields.php';
			}

			if ( class_exists( 'ReduxFramework' ) && class_exists( 'Village_Options' ) ) {
				require_once( 'includes/options.php' );
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

