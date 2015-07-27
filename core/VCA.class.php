<?php


class VCA extends Village {

	private static $config;
	public static $key;
	private static $options = false;

	const VERSION = "1.1.0";


	public function __construct( $root_file ) {

		self::$key = 'village_client_area_options';

		if ( ! isset( $root_file ) ) {
			$root_file = __FILE__;
		}


		$basename = basename( dirname( $root_file ) );
		$path     = trailingslashit( plugin_dir_path( $root_file ) );

		$config = array(

			'basename'  => trailingslashit( $basename ),
			'path'      => $path,
			'includes'  => $path . 'includes/',
			'templates' => trailingslashit( $basename ) . 'templates/',
			'url'       => trailingslashit( get_stylesheet_directory_uri() ) . trailingslashit( $basename ),
		);

		self::$config = apply_filters( 'vca_config', $config );


	}


	public static function conf( $key ) {
		if ( isset( self::$config[ $key ] ) ) {
			return self::$config[ $key ];
		} else {
			return false;
		}
	}

	/**
	 * Alias for native get_theme_mod(Village::get_key('some_option'));
	 *
	 * @param (string) $option to et
	 * @param bool $default
	 *
	 * @return mixed|void (mixed)  Option returned
	 */
	public static function get_option( $option, $default = false ) {
		// Get the options, if they aren't here yet
		global $wp_customize;

		if ( self::$options === false || isset( $wp_customize ) ) {
			self::$options = get_option( self::$key );
		}

		if ( ( in_the_loop() || is_singular() ) ) {
			$meta_value = self::get_post_meta( $option, "" );
			if ( $meta_value !== "" && $meta_value !== null ) {
				return self::return_option( $option, $meta_value );
			}
		}

		// Check if this option is set
		if ( isset( self::$options[ $option ] ) ) {
			return self::return_option( $option, self::$options[ $option ] );
		}

		return self::return_option( $option, $default );
	}

	private static function return_option( $key, $value ) {
		return apply_filters( 'vca_' . $key, $value );
	}


}