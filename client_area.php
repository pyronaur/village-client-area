<?php

require_once 'core/register_post_type.php';
require_once 'core/VCA.class.php';


$VCA = new VCA( __FILE__ );
$includes = VCA::conf('includes');



require_once $includes . 'client-functions.php';
require_once $includes . 'client-hooks.php';
require_once $includes . 'client-ajax.php';
require_once $includes . 'client-enqueue.php';

if( class_exists( 'ReduxFramework') && class_exists('Village_Options') ) {
	require_once( $includes . 'client-options.php' );
}


