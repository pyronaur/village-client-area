<form class="password-form" action="<?php echo esc_url( site_url( 'wp-login.php?action=postpass', 'login_post' ) ) ?>" method="post">
	<span class="pwf__subtitle"><?php esc_html_e('Enter your password to view this gallery', 'village-ca'); ?></span>
	<div class="form-fields">
		<input name="post_password" id="pasword" type="password" size="20" maxlength="20" />
		<button class="button" type="submit" name="Submit"><?php esc_html_e('Enter','village-ca'); ?></button>
	</div>
</form>