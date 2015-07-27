<?php
if ( ! defined( 'ABSPATH' ) )  exit; // Exit if accessed directly

/*
 * This isn't mean tto be a stand-alone file.
 * set_query_var() should set $village_query
 * If no $village_query, exit!
 */
if( ! isset( $village_query ) ){
	return;
}
?>
<?php if ( $village_query -> have_posts() ) : ?>

	<?php /* Start the Loop */ ?>
	<div class="masonry js__masonry client-area">
		<div class="grid-sizer"></div>
		<?php while ( $village_query -> have_posts() ) : $village_query -> the_post(); ?>


			<div id="gallery-<?php the_ID() ?>"  class="entry-masonry entry-masonry--with-content js__filter_element">
				<a class="js__unload" href="<?php the_permalink()?>" rel="bookmark">

					<div class="masonry-background">
						<?php the_post_thumbnail('portfolio_masonry'); ?>
					</div>

					<div class="masonry-content">

						<h2 class="entry-title js__filter_src"><?php the_title(); ?></h2>
						<h4 class="entry-subtitle date"><?php the_time('d M, Y'); ?></h4>

					</div>

				</a>
			</div>
			<!-- .entry-masonry-->


		<?php endwhile; ?>
	</div> <!-- .masonry -->


	<?php village_paging_nav(); ?>

<?php else : ?>

	<?php get_template_part( 'content', 'none' ); ?>

<?php endif; ?>

