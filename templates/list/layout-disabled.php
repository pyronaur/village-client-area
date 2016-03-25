<?php
/**
 * @TODO:
 *      Implement this. Currently this doesn't really exist.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<?php do_action( 'ca_content/before' ) ?>

<section class="error-content not-found">

	<i class="icon ion-ios-locked-outline"></i>

	<h1 class="big-title"><?php esc_html_e( 'Private Area!', 'village-ca' ); ?></h1>

	<div class="page-content">
		<p class="error_message"><?php printf( esc_html__( "Sorry, but I don't have anything for display in here. Client galleries are private.", 'village-ca' ), get_home_url() ); ?></p>
	</div>
	
</section><!-- .error-page -->

<?php do_action( 'ca_content/after' ) ?>
