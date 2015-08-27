<?php get_header('client-area'); ?>


<?php if ( have_posts() ) : ?>

	<?php while ( have_posts() ) : the_post(); ?>

		<?php
		// Skip this loop iteration if password is required
		if ( village_is_password_protected() ) {
			vca_get_template_part( 'protected/protected-content' );
			continue;
		}

		$masonry_data = array(
			'itemSelector' => '.ca-masonry-item',
			'columnWidth'  => '.grid-sizer'
		);
		?>

		<?php do_action( 'ca_content/before' ); ?>

		<div <?php post_class( 'entry-client-area' ) ?>>

			<?php vca_get_template_part( 'single/content-description' ); ?>

			<?php
			if ( CA_Option::get( 'enable_favorites', true ) ) {
				vca_get_template_part( 'single/gallery-filters' );
			}
			?>

			<div
				class="masonry js__masonry js__photoswipe js-masonry"<?php Village_Render::data( 'masonry-options', $masonry_data ); ?>>
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


		<?php do_action( 'ca_content/after' ); ?>

	<?php endwhile; ?>


<?php endif; ?>

<?php
get_footer('client-area');
?>