<?php

/**
 *
 *    This file displays Masonry Gallery from a Portfolio Post.
 *
 * @uses  Village_Gallery_Data to get the gallery data.
 *
 */


$gallery = new CA_Gallery_Data( get_the_ID(), array( 'full' ), 'ca_thumbnail' );
$images  = $gallery->get();

$slug                = get_the_ID();
$last_key            = count( $images ) - 1;
$entry_attr_template = array(
	'class' => array( 'ca-image', 'ca-masonry-item' ),
);

$enable_favorites  = CA_Option::get( 'enable_favorites', true );
$enable_smart_tags = CA_Option::get( 'enable_smart_tags', true );
$image_name_type = CA_Option::get( 'image_name_type', false );
?>


<?php foreach ( $images as $key => $image ): ?>

	<?php

	// Don't even display images without IDs
	if ( ! isset( $image['id'] ) || $image['id'] < 1 ) {
		continue;
	}

	if ( $image_name_type === 'filename' ) {
		$metadata = wp_get_attachment_metadata( $image['id'] );

		$file_path  = $metadata['file'];
		$image_name = basename( $file_path );
	}

	if ( $image_name_type === 'title' ) {
		$meta       = get_post( $image['id'] );
		$image_name = $meta->post_title;
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
		'class' => array( 'ca-image__meta' ),
		'data'  => array(
			'image-id' => $image['id'],
		)
	);

	if ( $selected ) {
		$entry_meta['class'][] = 'is-selected';
	}

	$entry_attr['id'] = 'ca-image-' . $image['id'];

	?>
	<div<?php Village_Render::attributes( $entry_attr ) ?>>
		<?php // All $image and $href attributes have been escaped in CA_Gallery_Data with @function wp_prepare_attachment_for_js() ?>
		<a<?php Village_Render::attributes( $image_link_attr ); ?> rel="village-gallery"
		                                                           href="<?php echo esc_url_raw( $href ); ?>"
		                                                           title="<?php echo esc_attr( $image['caption'] ); ?>">
			<img src="<?php echo esc_url_raw( $image['thumb'] ); ?>" alt="<?php echo esc_attr( $image['desc'] ); ?>"/>
		</a>

		<?php if ( $enable_smart_tags || $enable_favorites || isset( $image_name ) ) : ?>
			<div<?php Village_Render::attributes( $entry_meta ); ?>>

				<?php if ( $enable_smart_tags || isset( $image_name ) ) : ?>
					<div class="ca-image__title">
						<?php if ( isset( $image_name ) ) : ?>
							<div class="ca-image__name"><?php echo $image_name; ?></div>
						<?php endif ?>

						<?php if ( $enable_smart_tags ) : ?>
							<div class="ca-image__id<?php
							if ( isset( $image_name ) ) {
								echo " ca-image__id--as-tag";
							}
							?>">#<?php echo $image['id']; ?></div>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<?php if ( $enable_favorites ) {
					vca_get_template_part( 'single/image-actions' );
				} ?>

			</div>
		<?php endif; ?>

	</div>

<?php endforeach ?>