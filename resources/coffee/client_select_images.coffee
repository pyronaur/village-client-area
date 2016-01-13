
# There must be an AJAX URL
if not window.ajax_object? or not window.ajax_object.ajax_url?
	if console? and console.log?
		throw new Error "Ajax Object is required for Village Client Area"
		return

image_state_change = ( $this, is_selected ) ->
	if is_selected is 0
		# Deselect
		$this.removeClass('is-selected')
	else
		# Select
		$this.addClass('is-selected')

image_state_error = ( $this, is_selected ) ->

	# Revert is_selected value
	is_selected = if ( is_selected is 0 ) then 1 else 0

	# Revert state
	image_state_change( $this, is_selected )

	# Trigger Error
	display_error_message( $this )


display_error_message = ( $el ) ->
	# Try getting an image ID
	image_id = $el.data('imageId')

	# We need some form of ID:
	if not image_id
		image_id = 0

	$error = $('.ca-error__message.js__template')
		.clone()
		.removeClass('js__template')

	text = $error.text()
	text = text.replace('##image_id##', "##{image_id}")
	$error.text( text )


	$error
		.css('opacity', 0)
		.appendTo( $('.ca-error__container') )
		.velocity
			properties:
				translateY: [0, 10]
				opacity: [1, 0]
			options:
				duration: 600

	$error.velocity
		properties: 'fadeOut'
		options:
			duration: 2000
			delay: 3000
			easing: 'easeInOutQuad'
			complete: ->
				$error.remove()
				$error = null
				return


###
    Attach Events to .image-meta
###
$(document).on 'click', '.ca-image .ca-image__meta', ->

	$this = $(this)
	image_id = $this.data('imageId')

	if not image_id
		console.log "AJAX Error: Can't select/unselect an image without an ID"
		return

	is_selected = if ( not $this.is('.is-selected') ) then 1 else 0

	$this.addClass('is-loading')

	data =
		action: 'vca_save_state'
		attachment_id: image_id
		attachment_state: is_selected

	request =
		type: 'POST'
		url: ajax_object.ajax_url
		data: data
		dataType: 'json'
		success: (r) ->
			$this.removeClass('is-loading')

	$dfd = $.ajax(request)
	image_state_change($this, is_selected)

	$dfd.fail ->
		image_state_error($this, is_selected)