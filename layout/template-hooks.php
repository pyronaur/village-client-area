<?php


if( ! function_exists("ca_wrap_content_start") ) {
	function ca_wrap_content_start(  ) {
		vca_get_template_part('global/wrapper-start');
	}
}


if( ! function_exists("ca_wrap_content_end") ) {
	function ca_wrap_content_end(  ) {
		vca_get_template_part('global/wrapper-end');
	}
}