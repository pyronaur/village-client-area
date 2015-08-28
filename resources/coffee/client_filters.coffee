$input = $('#js__filter-input')

# We must have filters to do our thing
return if $input.length isnt 1

$filter_targets = $('.js__filter_element')

parse_links = ->
	index = []

	$filter_targets.each ( key, el ) ->
		$el = $(el)
		$title = $el.find('.js__filter_src')

		title = $title.text()

		index.push
			id: $el.attr('id')
			title: title
			el: $el.get(0)

	return index




DATA = parse_links()



find_matches = ( source, keyword ) ->
	matches = []


	for item in source
		if keyword.test( item.title )
			matches.push item

	return matches



# Keep track of value to avoid duplication
previous_value = ""



do_filter = (e) ->
	val = $input.val()

	return if val is previous_value
	previous_value = val

	# We need something to search for
	if val.length < 1
		$filter_targets.css 'display', ''
		$$('.masonry').masonry()
		return

	###
		Find matches
	###
	matches = DATA

	for value in val.split(" ")
		matches = find_matches( matches, new RegExp(value, "i") )

	if matches.length > 0
		# Do the filtering thing
		except = _.pluck(matches, 'el')
		$filter_targets
			.css 'display', ''
			.not( except )
			.css 'display', 'none'

		$input.removeClass('not-found')
	else
		# Not Found
		$filter_targets.css 'display', ''
		$input.addClass('not-found')

	$$('.masonry').masonry()


$input.on 'keyup', _.throttle( do_filter, 750 )
$input.on 'blur', ->
	$input.removeClass('not-found')



