<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * This isn't mean tto be a stand-alone file.
 * set_query_var() should set $village_query
 * If no $village_query, exit!
 */
if ( ! isset( $village_query ) ) {
	return;
}

$masonry_data = array(
	'itemSelector' => '.ca-masonry-item',
	'columnWidth'  => '.grid-sizer'
);

?>
<?php if ( $village_query->have_posts() ) : ?>

	<?php do_action( 'vca_content_before' ); ?>

	<?php /* Start the Loop */ ?>
	<div class="masonry js__masonry js-masonry"<?php Village_Render::data('masonry-options', $masonry_data); ?>>
		<div class="grid-sizer"></div>
		<?php while ( $village_query->have_posts() ) : $village_query->the_post(); ?>


			<div id="gallery-<?php the_ID() ?>" class="ca-entry ca-masonry-item js__filter_element">
				<a class="js__unload" href="<?php the_permalink() ?>" rel="bookmark">

					<div class="ca-masonry-item__background">
						<?php the_post_thumbnail( 'ca_thumbnail' ); ?>
					</div>

					<div class="ca-masonry-item__content">

						<h4 class="ca-entry__title js__filter_src"><?php the_title(); ?></h4>
						<span class="ca-entry__subtitle">
							<span class="ca-entry__date">
								<?php the_time( 'd M, Y' ); ?>
							</span>
						</span>

					</div>

				</a>
			</div>
			<!-- .entry-masonry-->


		<?php endwhile; ?>
	</div> <!-- .masonry -->


	<?php do_action( 'vca_content_after' ); ?>

<?php else : ?>

	<?php do_action('vca_content_404'); ?>

<?php endif; ?>

