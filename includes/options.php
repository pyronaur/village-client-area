<?php

$sections = array();
$args = array();



// ------------------------
//   Tab: Advanced
// ------------------------
$sections[] = array(
	'title'  => 'General',
	'icon'   => 'el-icon-wrench',
	'fields' => array(

		array(
			'id'       => "client_area_page",
			'title'    => "Client area archive page",
			'subtitle' => "In which page to list all client galleries ?",
			'type'     => 'select',
			'data' => 'pages',
		    'required' => 0,

		),

		array(
			'id'       => "enable_favorites",
			'title'    => "Enable Favorites",
			'subtitle' => "Let your clients pick their favorite images ?",
			'type'     => 'switch',
			'default'  => '1',
		),

		array(
			'id'       => "enable_comments",
			'title'    => "Enable Comments",
			'subtitle' => "Display comment area ?",
			'type'     => 'switch',
			'default'  => '1',
		),

		array(
			'id'       => "enable_smart_tags",
			'title'    => "Enable Smart Tags",
			'subtitle' => "Enable hoverable image number tags ?",
			'type'     => 'switch',
			'default'  => '1',
		),
	),

);












//-----------------------------------*/
// Initialize Redux:
//-----------------------------------*/
$args['display_name']    = 'Village Client Area';
$args['display_version'] = VCA()->version;
$args['menu_title']      = __( "Settings", 'village' );
$args['page_slug']       = 'village-client';
$args['menu_type'] = 'submenu';
$args['page_parent'] = 'edit.php?post_type=client_gallery';

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


$args = apply_filters('ca_redux_args', $args);
$sections = apply_filters('ca_redux_sections', $sections);

Redux::setArgs( CA_Option::$key, $args );
CA_Options_Parser::set_sections( CA_Option::$key, $sections );
