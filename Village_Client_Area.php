<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! class_exists( 'Village_Client_Area' ) ) :


	class Village_Client_Area {

		private static $config;

		public $version = '1.1.5';

		protected static $_instance = null;


		/**
		 * Main Client Area Instance
		 *
		 * Ensures only one instance of Client Area is loaded or can be loaded.
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
			_doing_it_wrong( __FUNCTION__, 'Cheatin&#8217; huh?', '1.0.0' );
		}

		/**
		 * Unserializing instances of this class is forbidden.
		 * @since 1.0.0
		 */
		public function __wakeup() {
			_doing_it_wrong( __FUNCTION__, 'Cheatin&#8217; huh?', '2.1' );
		}


		/**
		 * Constructor
		 */
		public function __construct() {

			$this->includes();
			$this->setup_image_size();
			$this->add_actions();
		}

		public function add_actions() {

			# Wait WP to initialize before including Custom Fields Config
			add_action( 'init', array( &$this, 'include_custom_fields_config' ) );
		}


		public function include_custom_fields_config() {

			if ( function_exists( 'acf_add_local_field_group' ) ) {
				require_once 'includes/advanced-custom-fields.php';
			}

		}


		public function setup_image_size() {

			global $content_width;
			if ( $content_width > 0 ) {

				// 3 columns
				$w = ceil( $content_width / 3 );
				$h = floor( $w * 1.6 );

				$image = array(
					'width'  => $w,
					'height' => $h
				);

			} else {
				$image = array(
					'width'  => 470,
					'height' => 750
				);
			}

			$image['crop'] = false;
			$image         = apply_filters( 'ca_thumbnail_size', $image );
			add_image_size( 'ca_thumbnail', $image['width'], $image['height'], $image['crop'] );


		}


		/**
		 * Include necessary files
		 */
		public function includes() {

			require_once 'includes/register_post_type.php';

			require_once 'core/CA_Options_Parser.class.php';
			require_once 'core/CA_Option.class.php';
			require_once 'core/CA_Template_Loader.class.php';
			require_once 'core/CA_Gallery_Data.class.php';
			require_once 'core/Village_Render.class.php';

			require_once 'includes/functions.php';
			require_once 'includes/hooks.php';
			require_once 'includes/ajax.php';
			require_once 'includes/enqueue.php';

			// Layout related
			require_once 'layout/template-functions.php';
			require_once 'layout/template-hooks.php';

			if ( function_exists( 'acf_add_local_field_group' ) ) {
				require_once 'includes/advanced-custom-fields.php';
			}

			if ( class_exists( 'ReduxFramework' ) && class_exists( 'CA_Options_Parser' ) ) {
				require_once( 'includes/redux-options.php' );
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

