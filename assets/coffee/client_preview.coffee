


return if $$('#vca-preview').length isnt 1


LAST_ID = -1
Hooks.addAction 'theme.resized', ->
	LAST_ID = -1
	return

hide_image_preview = ->
	$$('#vca-preview').css('display', 'none')

show_image_preview = ( image_id, $el ) ->
	$image_container = $$("#vca-image-#{image_id}")

	# We need only 1 image. Not 0, not 5.
	return if $image_container.length isnt 1

	# If the image is already there, don't re-do all the DOM modification
	if LAST_ID is image_id
		$$('#vca-preview').css('display', 'block')
		return


	$image = $image_container.find('img')
	$$('#vca-preview-content').html($image.clone())

	el_position = $el.offset()
	el_height = $el.outerHeight()

	$$('#vca-preview').css
		top: el_position.top + el_height + 2
		left: el_position.left
		display: 'block'

	LAST_ID = image_id
	return


###
   Attach Events to mouseenter and mouseleave
###

$$('.vca-preview-link').on "mouseenter", ->
	$this = $(this)
	image_hash = $this.text()

	# Use Regex to get only numbers from image_hash
	image_id = image_hash.replace /[^0-9]/g, ''

	show_image_preview( image_id, $this )

$$('.vca-preview-link').on "mouseleave", hide_image_preview