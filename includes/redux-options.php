<?php
$sections = array();
$args     = array();

// ------------------------
//   Tab: Advanced
// ------------------------
$sections[] = array(
	'title'  => esc_html__( 'General', 'village-ca' ),
	'icon'   => 'el-icon-wrench',
	'fields' => array(

		array(
			'id'    => "client_area_page",
			'title' => esc_html__( "Client area archive page", 'village-ca' ),
			'subtitle' => esc_html__( "In which page to list all client galleries ?", 'village-ca' ),
			'type'     => 'select',
			'data'     => 'pages',
			'required' => 0,

		),

		array(
			'id'    => "enable_favorites",
			'title' => esc_html__( "Enable Favorites", 'village-ca' ),
			'subtitle' => esc_html__( "Let your clients pick their favorite images ?", 'village-ca' ),
			'type'     => 'switch',
			'default'  => '1',
		),

		array(
			'id'    => "enable_comments",
			'title' => esc_html__( "Enable Comments", 'village-ca' ),
			'subtitle' => esc_html__( "Display comment area ?", 'village-ca' ),
			'type'     => 'switch',
			'default'  => '1',
		),

		array(
			'id'    => "enable_smart_tags",
			'title' => esc_html__( "Enable Smart Tags", 'village-ca' ),
			'subtitle' => esc_html__( "Enable hoverable image number tags ?", 'village-ca' ),
			'type'     => 'switch',
			'default'  => '1',
		),

		array(
			'id'    => "image_name_type",
			'title' => esc_html__( "Image Name", 'village-ca' ),
			'subtitle' => 'Show additional image info',
			'type'     => 'select',
			'options' => array(
				'none' => "Disable",
				'title' => 'Show image title',
				'filename' => 'Show image filename',
			),
			'default'  => 'none',
		),
	),

);


//-----------------------------------*/
// Initialize Redux:
//-----------------------------------*/
$args['display_name']    = 'Village Client Area';
$args['display_version'] = VCA()->version;
$args['menu_title']      = esc_html__( "Settings", 'village-ca' );
$args['page_slug']       = 'village-client';
$args['menu_type']       = 'submenu';
$args['page_parent']     = 'edit.php?post_type=client_gallery';

// Disable Redux CSS Output
$args['output']   = false;
$args['dev_mode'] = false;

$args['share_icons'][] = array(
	'url'   => 'http://twitter.com/Theme_Village',
	'title' => 'Follow us on Twitter',
	'icon'  => 'el-icon-twitter'
);
$args['share_icons'][] = array(
	'url'   => 'http://www.facebook.com/themevillage.net',
	'title' => 'Like us on Facebook',
	'icon'  => 'el-icon-facebook'
);


$args     = apply_filters( 'ca_redux_args', $args );
$sections = apply_filters( 'ca_redux_sections', $sections );

Redux::setArgs( CA_Option::$key, $args );
CA_Options_Parser::set_sections( CA_Option::$key, $sections );
