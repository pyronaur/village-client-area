<?php

/**
 * Define
 */
$client_area = array(
	'id'         => 'acf_client_gallery',
	'title'      => 'Client Gallery',
	'fields'     => array(
		array(
			'key'               => 'village_client_gallery',
			'label'             => 'Gallery',
			'name'              => 'village_gallery',
			'type'              => 'gallery',
			'preview_size'      => 'thumbnail',
			'library'           => 'all',
			'conditional_logic' => 0,
		),
	),
	'location'   => array(
		array(
			array(
				'param'    => 'post_type',
				'operator' => '==',
				'value'    => 'client_gallery',
			),
		),
	),
	'options'    => array(
		'position'       => 'acf_after_title',
		'hide_on_screen' => array( 'excerpt' ),
	),
	'menu_order' => 0,
);

$client_area_featured = array(
	'key'                   => 'acf_client_gallery_featured',
	'title'                 => 'Featured Background Image',
	'fields'                => array(
		array(
			'key'               => 'featured_background_image',
			'label'             => '',
			'name'              => 'featured_background_image',
			'type'              => 'image',
			'instructions'      => '',
			'required'          => 0,
			'conditional_logic' => 0,
			'wrapper'           => array(
				'width' => '',
				'class' => '',
				'id'    => '',
			),
			'return_format'     => 'array',
			'preview_size'      => 'medium',
			'library'           => 'all',
			'min_width'         => '',
			'min_height'        => '',
			'min_size'          => '',
			'max_width'         => '',
			'max_height'        => '',
			'max_size'          => '',
			'mime_types'        => '',
		),
	),
	'location'              => array(
		array(
			array(
				'param'    => 'post_type',
				'operator' => '==',
				'value'    => 'client_gallery',
			),
		),
	),
	'menu_order'            => 0,
	'position'              => 'side',
	'style'                 => 'default',
	'label_placement'       => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen'        => '',
);


/**
 *  Setup
 */
if ( function_exists( "register_field_group" ) ) {
	$client_area = apply_filters( 'village_client_area/acf_settings', $client_area );
	if ( ! empty( $client_area ) ) {
		register_field_group( $client_area );
	}

}




if ( function_exists( 'acf_add_local_field_group' ) ) {
	$args = apply_filters( 'village_client_area/acf_settings_featured', $client_area_featured );

	if ( ! empty( $args ) ) {
		acf_add_local_field_group( $args );
	}
}