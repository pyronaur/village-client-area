<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Village_Render' ) ):

	class Village_Render {
		//-----------------------------------*/
		// Helpers
		//-----------------------------------*/
		public static function classes( $class, $echo = true, $with_tag = true ) {
			$class = array_filter( (array) $class );

			// Stop if no class. Duh.
			if ( empty( $class ) ) {
				return;
			}

			$out = "";
			if ( $with_tag === true ) {
				$out .= " ";
				$out .= 'class="';
			}
			$class = array_map( "sanitize_html_class", $class );
			$out .= implode( " ", $class );

			if ( $with_tag === true ) {
				$out .= '"';
				$out .= " ";
			}

			if ( $echo === true ) {
				echo $out;
			} else {
				return $out;
			}

		}

		public static function style( $style, $echo = true, $with_tag = true ) {
			// Cast Style into an array
			$style = array_filter( (array) $style );

			// Stop if no style. Duh.
			if ( empty( $style ) ) {
				return;
			}
			$out = "";

			if ( $with_tag === true ) {
				$out .= " ";
				$out .= 'style="';
			}

			foreach ( $style as $property => $value ) {
				$out .= "{$property}:{$value};";
			}

			if ( $with_tag === true ) {
				$out .= '"';
				$out .= " ";

			}

			if ( $echo === true ) {
				echo $out;
			} else {
				return $out;
			}
		}

		public static function data( $name, $data, $echo = true, $with_tag = true ) {
			// Stop if no data. Duh.
			if ( empty( $data ) && "0" !== $data ) {
				return;
			}

			$out = "";
			if ( $with_tag === true ) {
				// Mind the single and double quotes.
				$out .= " ";
				$out .= " data-" . sanitize_html_class( $name ) . "='";
			}

			if ( is_string( $data ) !== true ) {
				$out .= json_encode( $data );
			} else {
				$out .= htmlspecialchars( $data );
			}


			if ( $with_tag === true ) {
				$out .= "'";
				$out .= " ";
			}

			if ( $echo === true ) {
				echo $out;
			} else {
				return $out;
			}

		}

		public static function id( $id, $echo = true ) {
			$out = ' id="' . $id . '"';

			if ( $echo === true ) {
				echo $out;
			} else {
				return $out;
			}
		}

		public static function attributes( $data, $echo = true ) {
			$out = "";

			if ( isset( $data['id'] ) ) {
				$out .= self::id( $data['id'], $echo );
			}

			if ( isset( $data['class'] ) ) {
				$out .= self::classes( $data['class'], $echo );
			}

			if ( isset( $data['style'] ) ) {
				$out .= self::style( $data['style'], $echo );
			}

			if ( isset( $data['data'] ) ) {
				foreach ( $data['data'] as $name => $data ) {
					$out .= self::data( $name, $data, $echo );
				}

			}

			if ( $echo === false ) {
				return $out;
			}
		}

	}

endif;