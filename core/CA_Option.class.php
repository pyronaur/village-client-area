<?php

if( ! defined('ABSPATH') ) exit;


class CA_Option {


	private static $options = false;
	public static $key = 'village_client_area_options';


	/**
	 * Alias for native get_theme_mod(Village::get_key('some_option'));
	 *
	 * @param (string) $option to et
	 * @param bool $default
	 *
	 * @return mixed|void (mixed)  Option returned
	 */
	public static function get( $option, $default = false ) {
		// Get the options, if they aren't here yet
		global $wp_customize;
		global $wp_query;

		if ( self::$options === false || isset( $wp_customize ) ) {
			self::$options = get_option( self::$key );
		}

		if ( isset( $wp_query ) && ( in_the_loop() || is_singular() ) ) {
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
		return apply_filters( 'ca_' . $key, $value );
	}


	/**
	 * Modification from the original wordpress get_post_meta()
	 *
	 * @param int     $post_id
	 * @param string  $meta_key
	 * @param boolean $single
	 *
	 * @return (mixed) boolean/string
	 */
	public static function get_post_meta( $key = '', $default = false, $single = true ) {
		$meta_key = self::$key . $key;
		$value    = get_post_meta( get_the_ID(), $meta_key, $single );

		if ( $value === "" or $value === array() ) {
			$value = $default;
		}

		if ( $single === true ) {
			$value = self::parse_truthy_value( $value );
		}

		return $value;
	}

	public static function parse_truthy_value( $value ) {

		if ( empty( $value ) || ! is_string( $value ) ) {
			return $value;
		}

		switch ( $value ) {
			case 'false':
				return false;
				break;
			case 'default':
				return null;
				break;
			case 'true':
				return true;
				break;


			default:
				return $value;
				break;
		}
	}

}