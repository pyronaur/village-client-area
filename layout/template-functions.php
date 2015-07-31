<?php


/**
 * Add Wrappers
 */
add_action('ca_content/before', 'ca_wrap_content_start');
add_action('ca_content/after', 'ca_wrap_content_end');