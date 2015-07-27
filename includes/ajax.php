<?php


add_action( 'wp_ajax_vca_save_state', 'vca_save_attachment_state' );
add_action( 'wp_ajax_nopriv_vca_save_state', 'vca_save_attachment_state' );

function vca_save_attachment_state() {

	// We must have a $POST['state'] to continue
	if ( ! isset( $_POST['attachment_state'] ) || empty( $_POST['attachment_id'] ) ) {
		return;
	}

	// Cast the values/states to be an int
	$id    = intval( $_POST['attachment_id'] );
	$state = intval( $_POST['attachment_state'] );

	// Get & Set Data
	$data                     = wp_get_attachment_metadata( $id );
	$data['attachment_state'] = $state;

	$result = wp_update_attachment_metadata( $id, $data );

	echo json_encode( array(
		'id'     => $id,
		'state'  => $state,
		'result' => $result,
	) );
	die();

}