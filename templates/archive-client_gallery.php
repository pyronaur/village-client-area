<?php
$query = new WP_Query( array(
	'post_type'      => 'client_gallery',
	'posts_per_page' => - 1,
) );
get_header( 'client-area' ); ?>
<?php
set_query_var( 'village_query', $query );
vca_get_template_part( 'list/layout' );
wp_reset_query();
?>
<?php get_footer( 'client-area' ); ?>

