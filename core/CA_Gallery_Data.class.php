<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'CA_Gallery_Data' ) ):

	class CA_Gallery_Data {

		private $ID;
		private $has_descriptions;

		function __construct( $post_id, $sizes = array( 'full' ), $thumb_size = 'medium' ) {

			$this->ID               = $post_id;
			$this->has_descriptions = false;
			$this->thumb_size       = $thumb_size;
			$this->sizes            = $sizes;

		}

		public function get() {
			return $this->get_portfolio_images();
		}

		public function has_descriptions() {
			return $this->has_descriptions;
		}

		function get_image_url( $image_id, $size ) {
			$image     = wp_get_attachment_image_src( $image_id, $size );
			$image_url = $image[0];

			return $image_url;
		}

		function get_thumbnail( $image_id ) {

			$thumb = wp_get_attachment_image_src( $image_id, $this->thumb_size );

			return array(
				'thumb'       => $thumb[0],
				'thumbwidth'  => $thumb[1],
				'thumbheight' => $thumb[2]
			);

		}

		function get_image( $image_id ) {

			$attachment_data = wp_prepare_attachment_for_js( $image_id );
			$image           = wp_array_slice_assoc( $attachment_data, array( 'sizes', 'caption', 'description' ) );


			if ( empty( $image ) ) {
				return false;
			}

			foreach ( $this->sizes as $size ) {

				$size_name = $size;

				if ( ! isset( $image['sizes'][ $size ] ) ) {
					$size           = 'full';
					$image['error'] = "wrong-size";
				}

				// Format Data
				$image[ $size_name ]['img']    = $image['sizes'][ $size ]['url'];
				$image[ $size_name ]['width']  = $image['sizes'][ $size ]['width'];
				$image[ $size_name ]['height'] = $image['sizes'][ $size ]['height'];

			}

			$image['id']   = $image_id;
			$image['desc'] = $image['description'];
			unset( $image['sizes'], $image['description'] );

			if ( ! $this->has_descriptions && ! empty( $image['description'] ) ) {
				$this->has_descriptions = true;
			}

			$image['desc']    = htmlspecialchars( str_replace( '"', '&quot;', $image['desc'] ), ENT_QUOTES );
			$image['caption'] = htmlspecialchars( str_replace( '"', '&quot;', $image['caption'] ), ENT_QUOTES );

			return $image;

		}

		function get_portfolio_images( $enable_thumbnails = true) {

			$images = get_post_meta( $this->ID, "village_gallery", true );

			if ( ! $images ) {
				return array();
			}

			$out = array();

			foreach ( $images as $key => $image_id ) {

				$image = $this->get_image( $image_id );

				// Skip if something is wrong with the image
				if ( ! $image ) {
					continue;
				}

				if ( $enable_thumbnails ) {
					$image += $this->get_thumbnail( $image_id );
				}

				if ( $video = get_post_meta( $image_id, '_attachment_video_url', true ) ) {
					$image['video'] = esc_url_raw( $video );
				}

				$out[] = $image;
			}

			return $out;
		}


	}


endif;