
LAST_ID = -1
Hooks.addAction 'theme.resized', ->
	LAST_ID = -1
	return

hide_image_preview = ->
	$('#ca-preview').css('display', 'none')

show_image_preview = ( image_id, $el ) ->
	$image_container = $("#ca-image-#{image_id}")

	# We need only 1 image. Not 0, not 5.
	return if $image_container.length isnt 1

	# If the image is already there, don't re-do all the DOM modification
	if LAST_ID is image_id
		$('#ca-preview').css('display', 'block')
		return


	$image = $image_container.find('img')
	$('#ca-preview-content').html($image.clone())

	el_position = $el.offset()
	el_height = $el.outerHeight()

	$('#ca-preview').css Hooks.applyFilters 'client.previewPosition',{
		top: el_position.top + el_height + 2
		left: el_position.left
		display: 'block'
	}

	LAST_ID = image_id
	return


###
   Attach Events to mouseenter and mouseleave
###
on_mouse_enter = ->
	$this = $(this)
	image_hash = $this.text()

	# Use Regex to get only numbers from image_hash
	image_id = image_hash.replace /[^0-9]/g, ''

	show_image_preview( image_id, $this )

initialize = ->
	if $('#ca-preview').length > 0
		$(document)
			.on 'mouseenter', '.ca-preview-link', on_mouse_enter
			.on 'mouseleave', '.ca-preview-link', hide_image_preview

destroy = ->
	$(document)
		.off 'mouseenter', '.ca-preview-link', on_mouse_enter
		.off 'mouseleave', '.ca-preview-link', hide_image_preview


###
    Attach Events
###
if App.config.standalone
	$(document).ready(initialize)

Hooks.addAction 'client.init', initialize
Hooks.addAction 'client.destroy', destroy