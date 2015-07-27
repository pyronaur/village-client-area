<?php get_header(); ?>


<?php if ( have_posts() ) : ?>

	<?php while ( have_posts() ) : the_post(); ?>

		<?php
		// Skip this loop iteration if password is required
		if ( village_is_password_protected() ) {
			vca_get_template_part( 'single/content-password-required' );
			continue;
		}

		$masonry_data = array(
			'itemSelector' => '.entry-masonry',
			'columnWidth' => '.grid-sizer'
		);
		?>

		<div id="primary" class="content-area">
			<main id="main" class="site-main" role="main">

				<div <?php post_class( 'entry-client-area' ) ?>>

					<?php vca_get_template_part( 'single/content-description' ); ?>

					<?php
					if( VCA_Option::get('enable_favorites', true) ) {
						vca_get_template_part( 'single/gallery-controls' );
					}
					?>

					<div class="masonry js__masonry js__photoswipe js-masonry"<?php Village_Render::data('masonry-options', $masonry_data); ?>>
						<div class="grid-sizer"></div>
						<?php vca_get_template_part( 'single/content-gallery' ); ?>
					</div>
					<!-- .masonry -->

				</div>

				<?php vca_comments_template(); ?>

				<?php
				/**
				 * Markup for JavaScript features
				 */
				vca_get_template_part( 'single/js-markup' )
				?>


			</main>
		</div>
	<?php endwhile; ?>


<?php endif; ?>

<?php
get_footer();
?>