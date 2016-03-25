<?php
/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
}
?>

<?php if ( have_comments() ) : ?>
<div id="comments" class="comments-area">
		<h1 class="comments-title">

			<?php
				printf( _nx( '%1$s comment', '%1$s comments', get_comments_number(), 'comment title', 'village-ca' ), number_format_i18n( get_comments_number() ) );
			?>
		</h1>

		<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
		<nav id="comment-nav-above" class="comment-navigation" role="navigation">
			<h1 class="screen-reader-text"><?php esc_html_e( 'Comment navigation', 'village-ca' ); ?></h1>
			<div class="nav-previous"><?php previous_comments_link( esc_html__( '&larr; Older Comments', 'village-ca' ) ); ?></div>
			<div class="nav-next"><?php next_comments_link( esc_html__( 'Newer Comments &rarr;', 'village-ca' ) ); ?></div>
		</nav><!-- #comment-nav-above -->
		<?php endif; // check for comment navigation ?>

		<ol class="comment-list">
			<?php
				wp_list_comments( array(
					'style'      => 'ol',
					'short_ping' => true,
				    'callback' => 'village_comment'
				) );
			?>
		</ol><!-- .comment-list -->

		<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
		<nav id="comment-nav-below" class="comment-navigation" role="navigation">
			<h1 class="screen-reader-text"><?php esc_html_e( 'Comment navigation', 'village-ca' ); ?></h1>
			<div class="nav-previous"><?php previous_comments_link( esc_html__( '&larr; Older Comments', 'village-ca' ) ); ?></div>
			<div class="nav-next"><?php next_comments_link( esc_html__( 'Newer Comments &rarr;', 'village-ca' ) ); ?></div>
		</nav><!-- #comment-nav-below -->
		<?php endif; // check for comment navigation ?>

</div><!-- #comments -->
<?php endif; // have_comments() ?>

	<?php
		// If comments are closed and there are comments, let's leave a little note, shall we?
		if ( ! comments_open() && '0' != get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
	?>
		<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'village-ca' ); ?></p>
	<?php endif; ?>



<?php comment_form(
	array(
		'comment_notes_after' => '',
		'label_submit'        => esc_html__( 'Comment', 'village-ca' ),


	'fields' => array(

		'author' =>
			'<p class="comment-form-author comment-field">' .
			'<input required="required" id="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) .
			'" size="30" aria-required="'. ( $req ? 'true' : 'false' ) .'" placeholder="' . esc_html__( 'Name', 'village-ca' ) . '"/>' 
			. ( $req ? '<span class="required">*</span>' : '' ) 
			. '</p>',

		'email' =>
			'<p class="comment-form-email comment-field">' .
			'<input required="required" id="email" name="email" type="email" value="' . esc_attr(  $commenter['comment_author_email'] ) .
			'" size="30" aria-required="'. ( $req ? 'true' : 'false' ) .'" placeholder="' . esc_html__( 'Email', 'village-ca' ) . '"/>'
			. ( $req ? '<span class="required">*</span>' : '' ) 
			. '</p>',

		'url' =>
			'<p class="comment-form-url comment-field">' .
			'<input id="url" name="url" placeholder="' . esc_html__( 'Your Site URL', 'village-ca' ) . '" type="url" value="' . esc_attr( $commenter['comment_author_url'] ) .
			'" size="30"/></p>',

		),

		'comment_field' => 
			'<p class="comment-form-comment">' .
				 '<textarea id="comment" name="comment" autocomplete="off" placeholder="' . _x( 'Comment', 'noun', 'village-ca' ) .  '" cols="45" rows="1" aria-required="true"></textarea>' .
			 '</p>',
	)

);














?>