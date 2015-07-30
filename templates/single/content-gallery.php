<?php

/**
 *
 *    This file displays Masonry Gallery from a Portfolio Post.
 *
 * @uses  Village_Gallery_Data to get the gallery data.
 *
 */


$gallery = new Village_Gallery_Data( get_the_ID(), array( 'full' ), 'portfolio_masonry' );
$images  = $gallery->get();

$slug                = get_the_ID();
$last_key            = count( $images ) - 1;
$entry_attr_template = array(
	'class' => array( 'ca-image', 'ca-masonry-item' ),
);

$enable_favorites  = VCA_Option::get( 'enable_favorites', true );
$enable_smart_tags = VCA_Option::get( 'enable_smart_tags', true );

?>


<?php foreach ( $images as $key => $image ): ?>

	<?php

	// Don't even display images without IDs
	if ( ! isset( $image['id'] ) || $image['id'] < 1 ) {
		continue;
	}


	// Copy default values to $portfolio_entry
	$entry_attr      = $entry_attr_template;
	$image_link_attr = array(

		'class' => array(),
		'data'  =>
			array(
				'desc' => $image['desc'],
				'size' => $image['full']['width'] . 'x' . $image['full']['height'],
			)

	);

	$image_link_attr['class'][] = 'type-image';
	$href                       = $image['full']['img'];


	$image_meta = wp_get_attachment_metadata( $image['id'] );

	if ( isset( $image_meta['attachment_state'] ) ) {
		$selected = intval( $image_meta['attachment_state'] );
	} else {
		$selected = false;
	}


	$entry_meta = array(
		'class' => array( 'image-meta' ),
		'data'  => array(
			'image-id' => $image['id'],
		)
	);

	if ( $selected ) {
		$entry_meta['class'][] = 'is-selected';
	}

	$entry_attr['id'] = 'vca-image-' . $image['id'];

	?>
	<div<?php Village_Render::attributes( $entry_attr ) ?>>
		<?php // All $image and $href attributes have been escaped in Village_Gallery_Data with @function wp_prepare_attachment_for_js() ?>
		<a<?php Village_Render::attributes( $image_link_attr ); ?> rel="village-gallery"
		                                                           href="<?php echo esc_url_raw( $href ); ?>"
		                                                           title="<?php echo esc_attr( $image['caption'] ); ?>">
			<img src="<?php echo esc_url_raw( $image['thumb'] ); ?>" alt="<?php echo esc_attr( $image['desc'] ); ?>"/>
		</a>


		<?php if ( $enable_smart_tags || $enable_favorites ) : ?>
			<div<?php Village_Render::attributes( $entry_meta ); ?>>

				<?php if ( $enable_smart_tags ) : ?>
					<div class="image-id">#<?php echo $image['id']; ?></div>
				<?php endif; ?>

				<?php if ( $enable_favorites ) {
					vca_get_template_part('single/image-status');
				}?>

			</div>
		<?php endif; ?>


	</div>
<?php endforeach ?>