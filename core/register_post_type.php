<?php

if ( ! function_exists('village_client_area') ) {

	// Register Custom Post Type
	function village_client_area() {

		$labels = array(
			'name'                => _x( 'Client Galleries', 'Post Type General Name', 'village' ),
			'singular_name'       => _x( 'Client Gallery', 'Post Type Singular Name', 'village' ),
			'menu_name'           => __( 'Client Area', 'village' ),
			'parent_item_colon'   => __( 'Parent Gallery:', 'village' ),
			'all_items'           => __( 'All Galleries', 'village' ),
			'view_item'           => __( 'View Gallery', 'village' ),
			'add_new_item'        => __( 'Add Gallery', 'village' ),
			'add_new'             => __( 'Add New', 'village' ),
			'edit_item'           => __( 'Edit Gallery', 'village' ),
			'update_item'         => __( 'Update Gallery', 'village' ),
			'search_items'        => __( 'Search Galleries', 'village' ),
			'not_found'           => __( 'Not found', 'village' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'village' ),
		);
		$rewrite = array(
			'slug'                => 'client-area',
			'with_front'          => true,
			'pages'               => false,
			'feeds'               => false,
		);

		$args = array(
			'label'               => __( 'client_gallery', 'village' ),
			'description'         => __( 'Client Galleries', 'village' ),
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
		register_post_type( 'client_gallery', $args );

	}

	// Hook into the 'init' action
	add_action( 'init', 'village_client_area', 5 );

}