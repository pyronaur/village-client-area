<?php

$protected_area = array(

	'class' => array('protected-area'),

);

$featured_image = get_post_meta(get_the_ID(), 'featured_background_image', true);
$image_url = wp_get_attachment_url( $featured_image );


if( !empty( $image_url )) {
	$protected_area['style']['background-image'] = 'url(' . $image_url . ')';
}


?>

<div<?php Village_Render::attributes( $protected_area ); ?>>

	<div class="entry-content content-area">

		<h3 class="protected-area__title"><?php the_title(); ?></h3>
		<div class="protected-area__password">
			<?php the_content(); ?>
		</div>



	</div>


</div>