<?php

$protected_area = array(

	'class' => array('protected-area'),

);
if( function_exists('get_field')  ){
	$featured_background = get_field('featured_background_image');

	if( !empty( $featured_background )) {
		$protected_area['style']['background-image'] = 'url(' . $featured_background['url'] . ')';
	}
}

?>

<div<?php Village::render_attributes( $protected_area ); ?>>

	<div class="entry-content content-area">

		<h3 class="protected-area__title"><?php the_title(); ?></h3>
		<div class="protected-area__password">
			<?php the_content(); ?>
		</div>



	</div>


</div>