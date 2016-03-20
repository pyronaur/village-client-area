<?php


/**
 * @TODO:
 *      * Trim this class to only necessary options
 *
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'CA_Options_Parser' ) ):

	class CA_Options_Parser {

		private static $sections;

		public static function make_int() {
			static $count;

			return "random-id-" . ++ $count;
		}

		public static function set_sections( $opt_key, $sections ) {
			self::$sections = $sections;

			foreach ( $sections as $section ) {
				CA_Options_Parser::set_section( $opt_key, $section );
			}

		}

		public static function set_section( $opt_key, $section ) {
			Redux::setSection( $opt_key, self::parse_section( $section ) );
		}

		public static function get_sections() {
			return self::$sections;
		}

		/**
		 * Prettify ugly array keys to appear nicely in a dropdown
		 *
		 * @param  (array) $keys Keys from which to generate pretty titles from
		 *
		 * @return array       Pretty Associative Array
		 * @uses   TV_Parser::prettify()
		 */
		public static function selectify( $keys ) {
			$values = self::prettify( $keys );

			return array_combine( $keys, $values );
		}

		/**
		 * Prettify a string or an array
		 * Think of this as "anti-sanitize_title"
		 * Turns a "sluggish" string/array into a pretty one
		 *
		 * @param  mixed   $var  Something Ugly
		 * @param  boolean $flip Only if $var is array - result is flipped.
		 *
		 * @return array|mixed|string    For whatever one sows, that will he also reap
		 */
		public static function prettify( $var, $flip = false ) {

			if ( is_string( $var ) ) {
				$var = str_replace( array( "-", "_" ), " ", $var );
				$var = ucwords( $var );

				return $var;

			} elseif ( is_array( $var ) ) {

				foreach ( $var as $key => $value ) {
					$pretty      = self::prettify( $value );
					$out[ $key ] = $pretty;
				}

				if ( $flip === true ) {
					$out = array_flip( $out );
				}

				return $out;
			}

			trigger_error( "Abstract_Shortcode::prettify was expecting a string or an array, received something else.", E_WARRNING );

			return $var;
		}


		public static function parse_sections( $sections ) {
			foreach ( $sections as $section_key => $section ) {
				$parsed_section = self::parse_section( $section );

				if ( $parsed_section ) {
					$sections[ $section_key ] = $parsed_section;
				}

			}

			return $sections;
		} // func parse_sections()


		public static function parse_section( $section ) {

			if ( ! isset( $section['fields'] ) ) {
				return false;
			}

			foreach ( $section['fields'] as $key => $field ) {

				if ( ! isset( $field['title'] )
				     && isset( $field['id'] )
				     && $field['type'] != 'divide'
				) {
					$field['title'] = self::prettify( $field['id'] );
				}

				$section['fields'][ $key ] = $field;
			}

			return $section;

		}

		public static function prepare_colors( $namespace, $array ) {
			$out = array();


			foreach ( $array as $color ) {
				$out[] = self::prepare_color_field( $namespace, $color );
			}

			return $out;
		}

		public static function prepare_color_field( $namespace, $color ) {

			// Use sanitize_title to Create an ID for the color
			if ( ! isset( $color['id'] ) ) {
				$color['id'] = sanitize_title( $namespace . '_' . $color['title'] );
			}


			// rgba or regular color
			if ( empty( $color['type'] ) ) {
				if ( is_string( $color['default'] ) ) {
					$color['type'] = 'color';
				} elseif ( is_array( $color['default'] ) ) {
					$color['type'] = 'color_rgba';
				}
			}


			// Turn shorthand defaults into an associative array
			if ( $color['type'] === 'color_rgba' ) {

				if ( ! isset( $color['default']['color'] ) ) {
					$color['default']['color'] = $color['default'][0];
				}

				if ( ! isset( $color['default']['alpha'] ) ) {
					$color['default']['alpha'] = $color['default'][1];
				}

			}


			// Set transparent if needed
			if ( $color['type'] === 'color' ) {

				if ( ! isset( $color['transparent'] ) ) {
					$color['transparent'] = false;
				}

				if ( ! isset( $color['validate'] ) ) {
					$color['validate'] = true;
				}
			}


			if ( ! empty( $color['selectors'] ) ) {

				/**
				 * Prepare array('color', 'border') to
				 * .selector {
				 *   color: blue;
				 *   border-color: blue;
				 * }
				 */
				if ( is_array( $color['css'] ) ) {

					$declarations = array();

					foreach ( $color['css'] as $css ) {

						if ( is_string( $css ) ) {
							$declarations[] = self::css_declaration( $css );
						}

						if ( is_array( $css ) ) {
							$declarations[] = $css;
						}
					}


					$color['css'] = array(
						$color['selectors'] => call_user_func_array( 'array_merge', $declarations )
					);
				} elseif ( is_string( $color['css'] ) ) {
					$color['css'] = array(
						$color['selectors'] => self::css_declaration( $color['css'] )
					);
				}
			}


			return $color;


		}

		public static function css_declaration( $template_name ) {
			switch ( $template_name ) {
				case 'background':
					$template = array(
						'background-color' => '%%value%%',
					);
					break;
				case 'color':
					$template = array(
						'color' => '%%value%%',
					);
					break;
				case 'border':
					$template = array(
						'border-color' => '%%value%%',
					);
					break;
				default:
					$template = false;
					break;
			}


			return $template;
		}

	}


endif; // end if ! class exists



