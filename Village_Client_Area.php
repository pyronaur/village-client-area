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
			$this->setup_image_size();

			if ( is_admin() && class_exists('CA_Github_Updater') ) {
				$this->setup_updates();
			}


		}

		public function setup_updates() {

			$config = array(
				// this is the slug of your plugin
				'slug'               => plugin_basename( __FILE__ ),

				// this is the name of the folder your plugin lives in
				'proper_folder_name' => 'village-client-area',

				// the GitHub API url of your GitHub repo
				'api_url'            => 'https://github.com/justnorris/village-client-area',

				// the GitHub raw url of your GitHub repo
				'raw_url'            => 'https://raw.github.com/justnorris/village-client-area/master',

				// the GitHub url of your GitHub repo
				'github_url'         => 'https://github.com/justnorris/village-client-area',

				// the zip url of the GitHub repo
				'zip_url'            => 'https://github.com/justnorris/village-client-area/zipball/master',

				// whether WP should check the validity of the SSL cert when getting an update, see https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/2 and https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/4 for details
				'sslverify'          => true,

				// which version of WordPress does your plugin require?
				'requires'           => '4.0',

				// which version of WordPress is your plugin tested up to?
				'tested'             => '4.3',

				// which file to use as the readme for the version number
				'readme'             => 'VERSION.md',

				// Access private repositories by authorizing under Appearance > GitHub Updates when this example plugin is installed
				'access_token'       => '',
			);

			new CA_Github_Updater( $config );
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

			if( is_admin() ) {
				require_once 'core/CA_Github_Updater.class.php';
			}

			if ( function_exists( 'acf_add_local_field_group' ) ) {
				require_once 'includes/advanced-custom-fields.php';
			}

			if ( class_exists( 'ReduxFramework' ) && class_exists( 'CA_Options_Parser' ) ) {
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

