<?php
//
//
//
//  FOR DEMO PURPOSES ONLY:
//
//

$post = get_post();


?><form class="password-form" action="<?php echo esc_url( site_url( 'wp-login.php?action=postpass', 'login_post' ) ) ?>" method="post">
	<span class="pwf__subtitle"><?php _e('Enter your password to view this gallery', 'village'); ?></span>
	<div class="form-fields">
		<input placeholder="Demo password is '<?php echo $post->post_password ?>'" name="post_password" id="pasword" type="password" size="20" maxlength="20" />
		<button class="button" type="submit" name="Submit">Enter</button>
	</div>
</form>