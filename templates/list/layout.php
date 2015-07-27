<?php
/**
 * Main client-area container
 */
if( ! defined('ABSPATH') ) exit;
?>
<div id="primary" class="content-area content-area--masonry">

	<main id="main" class="site-main--masonry masonry--client-area" role="main">

		<?php if( have_posts() ):?>
		<?php while ( have_posts() ) : the_post(); ?>

			<div class="entry-client-area">
				<h1 class="big-title"><?php the_title(); ?></h1>
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
			</div>

		<?php vca_get_template_part('list/content-search') ?>
		<?php vca_get_template_part('list/content-masonry') ?>

		<?php endwhile;?>
		<?php endif; ?>

	</main><!-- #main -->

</div><!-- #primary -->