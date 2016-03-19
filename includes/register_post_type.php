<?php

if ( ! function_exists( 'village_client_area' ) ) {

	// Register Custom Post Type
	function village_client_area() {

		$labels  = array(
			'name'               => _x( 'Client Galleries', 'Post Type General Name', 'village-area' ),
			'singular_name'      => _x( 'Client Gallery', 'Post Type Singular Name', 'village-area' ),
			'menu_name'          => esc_html__( 'Client Area', 'village-area' ),
			'parent_item_colon'  => esc_html__( 'Parent Gallery:', 'village-area' ),
			'all_items'          => esc_html__( 'All Galleries', 'village-area' ),
			'view_item'          => esc_html__( 'View Gallery', 'village-area' ),
			'add_new_item'       => esc_html__( 'Add Gallery', 'village-area' ),
			'add_new'            => esc_html__( 'Add New', 'village-area' ),
			'edit_item'          => esc_html__( 'Edit Gallery', 'village-area' ),
			'update_item'        => esc_html__( 'Update Gallery', 'village-area' ),
			'search_items'       => esc_html__( 'Search Galleries', 'village-area' ),
			'not_found'          => esc_html__( 'Not found', 'village-area' ),
			'not_found_in_trash' => esc_html__( 'Not found in Trash', 'village-area' ),
		);
		$rewrite = array(
			'slug'       => 'client-area',
			'with_front' => true,
			'pages'      => false,
			'feeds'      => false,
		);

		$args = array(
			'label'               => esc_html__( 'client_gallery', 'village-area' ),
			'description'         => esc_html__( 'Client Galleries', 'village-area' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor', 'thumbnail', 'revisions', 'custom-fields' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => true,
			'show_in_admin_bar'   => true,
			'menu_position'       => 6,
			'menu_icon'           => 'dashicons-images-alt2',
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'rewrite'             => $rewrite,
			'capability_type'     => 'page',
		);

		$args = apply_filters( 'village_client_area/post_type', $args );
		register_post_type( 'client_gallery', $args );

	}

	// Hook into the 'init' action
	add_action( 'init', 'village_client_area', 5 );

}