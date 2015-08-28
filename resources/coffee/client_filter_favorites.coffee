class VCA_Filters

	reload: ->
		$$('.js__masonry').masonry('layout')

	selected: ->
		@all()

		$$('.ca-image')
			.filter(-> ($(this).find('.is-selected').length isnt 1))
			.css('display', 'none')

		@reload()

	unselected: ->
		@all()
		$$('.ca-image')
			.filter(-> ($(this).find('.is-selected').length is 1))
			.css('display', 'none')

		@reload()

	all: ->
		$$('.ca-image').css('display', '')
		@reload()

filters = new VCA_Filters

$$('.js__ca-action').on 'click', ->

	# Setup
	$this = $(this)
	action = $this.data('action')

	# We need an action
	return if not action

	$$('.js__ca-action').removeClass('is-active')
	$this.addClass('is-active')

	filters[action]()


