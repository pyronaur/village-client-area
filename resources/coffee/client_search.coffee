

__$TARGETS = null
__$INPUT = null
__DATA = null

# Keep track of value to avoid duplication
__PREVIOUS_VALUE = ""


parse_links = ->
	index = []

	__$TARGETS.each ( key, el ) ->
		$el = $(el)
		$title = $el.find('.js__filter_src')

		title = $title.text()

		index.push
			id: $el.attr('id')
			title: title
			el: $el.get(0)

	return index


find_matches = ( source, keyword ) ->
	matches = []


	for item in source
		if keyword.test( item.title )
			matches.push item

	return matches





do_filter = (e) ->
	val = __$INPUT.val()

	return if val is __PREVIOUS_VALUE
	__PREVIOUS_VALUE = val

	# We need something to search for
	if val.length < 1
		__$TARGETS.css 'display', ''
		$('.masonry').masonry()
		return

	###
		Find matches
	###
	matches = __DATA

	for value in val.split(" ")
		matches = find_matches( matches, new RegExp(value, "i") )

	if matches.length > 0
		# Do the filtering thing
		except = _.pluck(matches, 'el')
		__$TARGETS
			.css 'display', ''
			.not( except )
			.css 'display', 'none'

		__$INPUT.removeClass('not-found')
	else
		# Not Found
		__$TARGETS.css 'display', ''
		__$INPUT.addClass('not-found')

	$('.masonry').masonry()

throttled_filter = _.throttle( do_filter, 750 )

reset_input_state = (e) ->
	__$INPUT.removeClass('not-found')

destroy = ->
	__$INPUT = $('#js__filter-input')

	# We must have filters to do our thing
	return if __$INPUT.length isnt 1

	# Remove Events
	__$INPUT.off 'keyup', throttled_filter
	__$INPUT.off 'blur', reset_input_state

	# Clear vars
	__$TARGETS = null
	__$INPUT = null
	__DATA = null
	__PREVIOUS_VALUE = ""


initialize = ->
	__$INPUT = $('#js__filter-input')

	# We must have filters to do our thing
	return if __$INPUT.length isnt 1

	__$TARGETS = $('.js__filter_element')
	__DATA = parse_links()

	__$INPUT.on 'keyup', throttled_filter
	__$INPUT.on 'blur', reset_input_state


$(document).ready initialize

Hooks.addAction 'client.filters/init', initialize
Hooks.addAction 'client.filters/destroy', destroy