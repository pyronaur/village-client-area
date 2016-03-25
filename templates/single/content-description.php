<?php
/**
 *
 *    This file displays Portfolio Title & Description
 *
 */


?>
<div class="entry-content__wrap">
	<div class="entry-content">

		<h1 class="ca-title">
			<?php the_title() ?>
		</h1>

		<?php if ( get_the_content() ): ?>

			<?php the_content(); ?>

			<?php if ( current_user_can( 'edit_published_posts' ) ): ?>
				<div class="edit-post"><?php edit_post_link( esc_html__( 'Edit', 'village-ca' ) ); ?></div>
			<?php endif; ?>

		<?php endif; ?>

	</div>
	<!--.entry-content-->
</div>
<!--.entry-content__wrap-->