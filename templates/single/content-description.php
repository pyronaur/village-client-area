<?php
/**
 *
 *    This file displays Portfolio Title & Description
 *
 */


?>
<div class="entry-content__wrap">

	<h1 class="big-title">
		<?php the_title() ?>
	</h1>



	<?php if ( get_the_content() ): ?>
		<div class="entry-content">
			<?php the_content(); ?>
			<?php if ( current_user_can( 'edit_published_posts' ) ): ?>
				<div class="edit-post"><?php edit_post_link( "Edit" ); ?></div>
			<?php endif; ?>
		</div>
		<!--.entry-content-->
	<?php endif; ?>

</div>
<!--.entry-content__wrap-->