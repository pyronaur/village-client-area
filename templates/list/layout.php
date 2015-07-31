<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<?php do_action( 'ca_content/before' ); ?>

<?php if ( have_posts() ): ?>
	<?php while ( have_posts() ) : the_post(); ?>

		<div class="ca-desc">
			<h1 class="ca-desc__title"><?php the_title(); ?></h1>

			<div class="ca-desc__content">
				<?php the_content(); ?>
			</div>
		</div>

		<?php vca_get_template_part( 'list/content-search' ) ?>
		<?php vca_get_template_part( 'list/content-masonry' ) ?>

	<?php endwhile; ?>
<?php endif; ?>

<?php do_action( 'ca_content/after' ); ?>