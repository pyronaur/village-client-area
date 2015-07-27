
(function() { 
 	"use strict";
	var $, $$, Hooks, App;
	$ = jQuery;
	$$ = $.q;
	App = {};
	Hooks = window.wp.hooks;
    (function() {
  var VCA_Filters, filters;

  VCA_Filters = (function() {
    function VCA_Filters() {}

    VCA_Filters.prototype.reload = function() {
      return $$('.js__masonry').masonry('layout');
    };

    VCA_Filters.prototype.selected = function() {
      this.all();
      $$('.vca-image').filter(function() {
        return $(this).find('.is-selected').length !== 1;
      }).css('display', 'none');
      return this.reload();
    };

    VCA_Filters.prototype.unselected = function() {
      this.all();
      $$('.vca-image').filter(function() {
        return $(this).find('.is-selected').length === 1;
      }).css('display', 'none');
      return this.reload();
    };

    VCA_Filters.prototype.all = function() {
      $$('.vca-image').css('display', '');
      return this.reload();
    };

    return VCA_Filters;

  })();

  filters = new VCA_Filters;

  $$('.js__vca-action').on('click', function() {
    var $this, action;
    $this = $(this);
    action = $this.data('action');
    if (!action) {
      return;
    }
    $$('.js__vca-action').removeClass('is-active');
    $this.addClass('is-active');
    return filters[action]();
  });

}).call(this);

(function() {
  var $filter_targets, $input, DATA, do_filter, find_matches, parse_links, previous_value;

  $input = $('#js__filter-input');

  if ($input.length !== 1) {
    return;
  }

  $filter_targets = $('.js__filter_element');

  parse_links = function() {
    var index;
    index = [];
    $filter_targets.each(function(key, el) {
      var $el, $title, title;
      $el = $(el);
      $title = $el.find('.js__filter_src');
      title = $title.text();
      return index.push({
        id: $el.attr('id'),
        title: title,
        el: $el.get(0)
      });
    });
    return index;
  };

  DATA = parse_links();

  find_matches = function(source, keyword) {
    var i, item, len, matches;
    matches = [];
    for (i = 0, len = source.length; i < len; i++) {
      item = source[i];
      if (keyword.test(item.title)) {
        matches.push(item);
      }
    }
    return matches;
  };

  previous_value = "";

  do_filter = function(e) {
    var except, i, len, matches, ref, val, value;
    val = $input.val();
    if (val === previous_value) {
      return;
    }
    previous_value = val;
    if (val.length < 1) {
      $filter_targets.css('display', '');
      $$('.masonry').masonry();
      return;
    }

    /*
    		Find matches
     */
    matches = DATA;
    ref = val.split(" ");
    for (i = 0, len = ref.length; i < len; i++) {
      value = ref[i];
      matches = find_matches(matches, new RegExp(value, "i"));
    }
    if (matches.length > 0) {
      except = _.pluck(matches, 'el');
      $filter_targets.css('display', '').not(except).css('display', 'none');
      $input.removeClass('not-found');
    } else {
      $filter_targets.css('display', '');
      $input.addClass('not-found');
    }
    return $$('.masonry').masonry();
  };

  $input.on('keyup', _.throttle(do_filter, 750));

  $input.on('blur', function() {
    return $input.removeClass('not-found');
  });

}).call(this);

(function() {
  var LAST_ID, hide_image_preview, show_image_preview;

  if ($$('#vca-preview').length !== 1) {
    return;
  }

  LAST_ID = -1;

  Hooks.addAction('theme.resized', function() {
    LAST_ID = -1;
  });

  hide_image_preview = function() {
    return $$('#vca-preview').css('display', 'none');
  };

  show_image_preview = function(image_id, $el) {
    var $image, $image_container, el_height, el_position;
    $image_container = $$("#vca-image-" + image_id);
    if ($image_container.length !== 1) {
      return;
    }
    if (LAST_ID === image_id) {
      $$('#vca-preview').css('display', 'block');
      return;
    }
    $image = $image_container.find('img');
    $$('#vca-preview-content').html($image.clone());
    el_position = $el.offset();
    el_height = $el.outerHeight();
    $$('#vca-preview').css({
      top: el_position.top + el_height + 2,
      left: el_position.left,
      display: 'block'
    });
    LAST_ID = image_id;
  };


  /*
     Attach Events to mouseenter and mouseleave
   */

  $$('.vca-preview-link').on("mouseenter", function() {
    var $this, image_hash, image_id;
    $this = $(this);
    image_hash = $this.text();
    image_id = image_hash.replace(/[^0-9]/g, '');
    return show_image_preview(image_id, $this);
  });

  $$('.vca-preview-link').on("mouseleave", hide_image_preview);

}).call(this);

(function() {
  var display_error_message, image_state_change, image_state_error;

  if ((window.ajax_object == null) || (window.ajax_object.ajax_url == null)) {
    if ((typeof console !== "undefined" && console !== null) && (console.log != null)) {
      throw new Error("Ajax Object is required for Village Client Area");
      return;
    }
  }

  image_state_change = function($this, is_selected) {
    if (is_selected === 0) {
      return $this.removeClass('is-selected');
    } else {
      return $this.addClass('is-selected');
    }
  };

  image_state_error = function($this, is_selected) {
    is_selected = is_selected === 0 ? 1 : 0;
    image_state_change($this, is_selected);
    return display_error_message($this);
  };

  display_error_message = function($el) {
    var $error, image_id, text;
    image_id = $el.data('imageId');
    if (!image_id) {
      image_id = 0;
    }
    $error = $$('.vca-error__message.js__template').clone().removeClass('js__template');
    text = $error.text();
    text = text.replace('##image_id##', "#" + image_id);
    $error.text(text);
    $error.css('opacity', 0).appendTo($$('.vca-error__container')).velocity({
      properties: {
        translateY: [0, 10],
        opacity: [1, 0]
      },
      options: {
        duration: 600
      }
    });
    return $error.velocity({
      properties: 'fadeOut',
      options: {
        duration: 2000,
        delay: 3000,
        easing: 'easeInOutQuad',
        complete: function() {
          $error.remove();
          $error = null;
        }
      }
    });
  };


  /*
      Attach Events to .image-meta
   */

  $('.vca-image .image-meta').on('click', function() {
    var $dfd, $this, data, image_id, is_selected, request;
    $this = $(this);
    image_id = $this.data('imageId');
    if (!image_id) {
      console.log("AJAX Error: Can't select/unselect an image without an ID");
      return;
    }
    is_selected = !$this.is('.is-selected') ? 1 : 0;
    $this.addClass('is-loading');
    data = {
      action: 'vca_save_state',
      attachment_id: image_id,
      attachment_state: is_selected
    };
    request = {
      type: 'POST',
      url: ajax_object.ajax_url,
      data: data,
      dataType: 'json',
      success: function(r) {
        return $this.removeClass('is-loading');
      }
    };
    $dfd = $.ajax(request);
    image_state_change($this, is_selected);
    return $dfd.fail(function() {
      return image_state_error($this, is_selected);
    });
  });

}).call(this);

}).call(this);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudF9maWx0ZXJfZmF2b3JpdGVzLmNvZmZlZSIsImNsaWVudF9maWx0ZXJzLmNvZmZlZSIsImNsaWVudF9wcmV2aWV3LmNvZmZlZSIsImNsaWVudF9zZWxlY3RfaW1hZ2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU07OzswQkFFTCxNQUFBLEdBQVEsU0FBQTthQUNQLEVBQUEsQ0FBRyxjQUFILENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsUUFBM0I7SUFETzs7MEJBR1IsUUFBQSxHQUFVLFNBQUE7TUFDVCxJQUFDLENBQUEsR0FBRCxDQUFBO01BRUEsRUFBQSxDQUFHLFlBQUgsQ0FDQyxDQUFDLE1BREYsQ0FDUyxTQUFBO2VBQUksQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxjQUFiLENBQTRCLENBQUMsTUFBN0IsS0FBeUM7TUFBN0MsQ0FEVCxDQUVDLENBQUMsR0FGRixDQUVNLFNBRk4sRUFFaUIsTUFGakI7YUFJQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBUFM7OzBCQVNWLFVBQUEsR0FBWSxTQUFBO01BQ1gsSUFBQyxDQUFBLEdBQUQsQ0FBQTtNQUNBLEVBQUEsQ0FBRyxZQUFILENBQ0MsQ0FBQyxNQURGLENBQ1MsU0FBQTtlQUFJLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsY0FBYixDQUE0QixDQUFDLE1BQTdCLEtBQXVDO01BQTNDLENBRFQsQ0FFQyxDQUFDLEdBRkYsQ0FFTSxTQUZOLEVBRWlCLE1BRmpCO2FBSUEsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQU5XOzswQkFRWixHQUFBLEdBQUssU0FBQTtNQUNKLEVBQUEsQ0FBRyxZQUFILENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBckIsRUFBZ0MsRUFBaEM7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRkk7Ozs7OztFQUlOLE9BQUEsR0FBVSxJQUFJOztFQUVkLEVBQUEsQ0FBRyxpQkFBSCxDQUFxQixD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Q0FBSSxRQUFQO01BQ0MsT0FBTyxDQUFDLEdBQVIsQ0FBWSwwREFBWjtBQUNBLGFBRkQ7O0lBSUEsV0FBQSxHQUFtQixDQUFJLEtBQUssQ0FBQyxFQUFOLENBQVMsY0FBVCxDQUFULEdBQXlDLENBQXpDLEdBQWdEO0lBRTlELEtBQUssQ0FBQyxRQUFOLENBQWUsWUFBZjtJQUVBLElBQUEsR0FDQztNQUFBLE1BQUEsRUFBUSxnQkFBUjtNQUNBLGFBQUEsRUFBZSxRQURmO01BRUEsZ0JBQUEsRUFBa0IsV0FGbEI7O0lBSUQsT0FBQSxHQUNDO01BQUEsSUFBQSxFQUFNLE1BQU47TUFDQSxHQUFBLEVBQUssV0FBVyxDQUFDLFFBRGpCO01BRUEsSUFBQSxFQUFNLElBRk47TUFHQSxRQUFBLEVBQVUsTUFIVjtNQUlBLE9BQUEsRUFBUyxTQUFDLENBQUQ7ZUFDUixLQUFLLENBQUMsV0FBTixDQUFrQixZQUFsQjtNQURRLENBSlQ7O0lBT0QsSUFBQSxHQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sT0FBUDtJQUNQLGtCQUFBLENBQW1CLEtBQW5CLEVBQTBCLFdBQTFCO1dBRUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFBO2FBQ1QsaUJBQUEsQ0FBa0IsS0FBbEIsRUFBeUIsV0FBekI7SUFEUyxDQUFWO0VBN0J1QyxDQUF4QztBQW5FQSIsImZpbGUiOiJjbGllbnQtYXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFZDQV9GaWx0ZXJzXG5cblx0cmVsb2FkOiAtPlxuXHRcdCQkKCcuanNfX21hc29ucnknKS5tYXNvbnJ5KCdsYXlvdXQnKVxuXG5cdHNlbGVjdGVkOiAtPlxuXHRcdEBhbGwoKVxuXG5cdFx0JCQoJy52Y2EtaW1hZ2UnKVxuXHRcdFx0LmZpbHRlcigtPiAoJCh0aGlzKS5maW5kKCcuaXMtc2VsZWN0ZWQnKS5sZW5ndGggaXNudCAxKSlcblx0XHRcdC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpXG5cblx0XHRAcmVsb2FkKClcblxuXHR1bnNlbGVjdGVkOiAtPlxuXHRcdEBhbGwoKVxuXHRcdCQkKCcudmNhLWltYWdlJylcblx0XHRcdC5maWx0ZXIoLT4gKCQodGhpcykuZmluZCgnLmlzLXNlbGVjdGVkJykubGVuZ3RoIGlzIDEpKVxuXHRcdFx0LmNzcygnZGlzcGxheScsICdub25lJylcblxuXHRcdEByZWxvYWQoKVxuXG5cdGFsbDogLT5cblx0XHQkJCgnLnZjYS1pbWFnZScpLmNzcygnZGlzcGxheScsICcnKVxuXHRcdEByZWxvYWQoKVxuXG5maWx0ZXJzID0gbmV3IFZDQV9GaWx0ZXJzXG5cbiQkKCcuanNfX3ZjYS1hY3Rpb24nKS5vbiAnY2xpY2snLCAtPlxuXG5cdCMgU2V0dXBcblx0JHRoaXMgPSAkKHRoaXMpXG5cdGFjdGlvbiA9ICR0aGlzLmRhdGEoJ2FjdGlvbicpXG5cblx0IyBXZSBuZWVkIGFuIGFjdGlvblxuXHRyZXR1cm4gaWYgbm90IGFjdGlvblxuXG5cdCQkKCcuanNfX3ZjYS1hY3Rpb24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJylcblx0JHRoaXMuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpXG5cblx0ZmlsdGVyc1thY3Rpb25dKClcblxuXG4iLCIkaW5wdXQgPSAkKCcjanNfX2ZpbHRlci1pbnB1dCcpXG5cbiMgV2UgbXVzdCBoYXZlIGZpbHRlcnMgdG8gZG8gb3VyIHRoaW5nXG5yZXR1cm4gaWYgJGlucHV0Lmxlbmd0aCBpc250IDFcblxuJGZpbHRlcl90YXJnZXRzID0gJCgnLmpzX19maWx0ZXJfZWxlbWVudCcpXG5cbnBhcnNlX2xpbmtzID0gLT5cblx0aW5kZXggPSBbXVxuXG5cdCRmaWx0ZXJfdGFyZ2V0cy5lYWNoICgga2V5LCBlbCApIC0+XG5cdFx0JGVsID0gJChlbClcblx0XHQkdGl0bGUgPSAkZWwuZmluZCgnLmpzX19maWx0ZXJfc3JjJylcblxuXHRcdHRpdGxlID0gJHRpdGxlLnRleHQoKVxuXG5cdFx0aW5kZXgucHVzaFxuXHRcdFx0aWQ6ICRlbC5hdHRyKCdpZCcpXG5cdFx0XHR0aXRsZTogdGl0bGVcblx0XHRcdGVsOiAkZWwuZ2V0KDApXG5cblx0cmV0dXJuIGluZGV4XG5cblxuXG5cbkRBVEEgPSBwYXJzZV9saW5rcygpXG5cblxuXG5maW5kX21hdGNoZXMgPSAoIHNvdXJjZSwga2V5d29yZCApIC0+XG5cdG1hdGNoZXMgPSBbXVxuXG5cblx0Zm9yIGl0ZW0gaW4gc291cmNlXG5cdFx0aWYga2V5d29yZC50ZXN0KCBpdGVtLnRpdGxlIClcblx0XHRcdG1hdGNoZXMucHVzaCBpdGVtXG5cblx0cmV0dXJuIG1hdGNoZXNcblxuXG5cbiMgS2VlcCB0cmFjayBvZiB2YWx1ZSB0byBhdm9pZCBkdXBsaWNhdGlvblxucHJldmlvdXNfdmFsdWUgPSBcIlwiXG5cblxuXG5kb19maWx0ZXIgPSAoZSkgLT5cblx0dmFsID0gJGlucHV0LnZhbCgpXG5cblx0cmV0dXJuIGlmIHZhbCBpcyBwcmV2aW91c192YWx1ZVxuXHRwcmV2aW91c192YWx1ZSA9IHZhbFxuXG5cdCMgV2UgbmVlZCBzb21ldGhpbmcgdG8gc2VhcmNoIGZvclxuXHRpZiB2YWwubGVuZ3RoIDwgMVxuXHRcdCRmaWx0ZXJfdGFyZ2V0cy5jc3MgJ2Rpc3BsYXknLCAnJ1xuXHRcdCQkKCcubWFzb25yeScpLm1hc29ucnkoKVxuXHRcdHJldHVyblxuXG5cdCMjI1xuXHRcdEZpbmQgbWF0Y2hlc1xuXHQjIyNcblx0bWF0Y2hlcyA9IERBVEFcblxuXHRmb3IgdmFsdWUgaW4gdmFsLnNwbGl0KFwiIFwiKVxuXHRcdG1hdGNoZXMgPSBmaW5kX21hdGNoZXMoIG1hdGNoZXMsIG5ldyBSZWdFeHAodmFsdWUsIFwiaVwiKSApXG5cblx0aWYgbWF0Y2hlcy5sZW5ndGggPiAwXG5cdFx0IyBEbyB0aGUgZmlsdGVyaW5nIHRoaW5nXG5cdFx0ZXhjZXB0ID0gXy5wbHVjayhtYXRjaGVzLCAnZWwnKVxuXHRcdCRmaWx0ZXJfdGFyZ2V0c1xuXHRcdFx0LmNzcyAnZGlzcGxheScsICcnXG5cdFx0XHQubm90KCBleGNlcHQgKVxuXHRcdFx0LmNzcyAnZGlzcGxheScsICdub25lJ1xuXG5cdFx0JGlucHV0LnJlbW92ZUNsYXNzKCdub3QtZm91bmQnKVxuXHRlbHNlXG5cdFx0IyBOb3QgRm91bmRcblx0XHQkZmlsdGVyX3RhcmdldHMuY3NzICdkaXNwbGF5JywgJydcblx0XHQkaW5wdXQuYWRkQ2xhc3MoJ25vdC1mb3VuZCcpXG5cblx0JCQoJy5tYXNvbnJ5JykubWFzb25yeSgpXG5cblxuJGlucHV0Lm9uICdrZXl1cCcsIF8udGhyb3R0bGUoIGRvX2ZpbHRlciwgNzUwIClcbiRpbnB1dC5vbiAnYmx1cicsIC0+XG5cdCRpbnB1dC5yZW1vdmVDbGFzcygnbm90LWZvdW5kJylcblxuXG5cbiIsIlxuXG5cbnJldHVybiBpZiAkJCgnI3ZjYS1wcmV2aWV3JykubGVuZ3RoIGlzbnQgMVxuXG5cbkxBU1RfSUQgPSAtMVxuSG9va3MuYWRkQWN0aW9uICd0aGVtZS5yZXNpemVkJywgLT5cblx0TEFTVF9JRCA9IC0xXG5cdHJldHVyblxuXG5oaWRlX2ltYWdlX3ByZXZpZXcgPSAtPlxuXHQkJCgnI3ZjYS1wcmV2aWV3JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxuXG5zaG93X2ltYWdlX3ByZXZpZXcgPSAoIGltYWdlX2lkLCAkZWwgKSAtPlxuXHQkaW1hZ2VfY29udGFpbmVyID0gJCQoXCIjdmNhLWltYWdlLSN7aW1hZ2VfaWR9XCIpXG5cblx0IyBXZSBuZWVkIG9ubHkgMSBpbWFnZS4gTm90IDAsIG5vdCA1LlxuXHRyZXR1cm4gaWYgJGltYWdlX2NvbnRhaW5lci5sZW5ndGggaXNudCAxXG5cblx0IyBJZiB0aGUgaW1hZ2UgaXMgYWxyZWFkeSB0aGVyZSwgZG9uJ3QgcmUtZG8gYWxsIHRoZSBET00gbW9kaWZpY2F0aW9uXG5cdGlmIExBU1RfSUQgaXMgaW1hZ2VfaWRcblx0XHQkJCgnI3ZjYS1wcmV2aWV3JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJylcblx0XHRyZXR1cm5cblxuXG5cdCRpbWFnZSA9ICRpbWFnZV9jb250YWluZXIuZmluZCgnaW1nJylcblx0JCQoJyN2Y2EtcHJldmlldy1jb250ZW50JykuaHRtbCgkaW1hZ2UuY2xvbmUoKSlcblxuXHRlbF9wb3NpdGlvbiA9ICRlbC5vZmZzZXQoKVxuXHRlbF9oZWlnaHQgPSAkZWwub3V0ZXJIZWlnaHQoKVxuXG5cdCQkKCcjdmNhLXByZXZpZXcnKS5jc3Ncblx0XHR0b3A6IGVsX3Bvc2l0aW9uLnRvcCArIGVsX2hlaWdodCArIDJcblx0XHRsZWZ0OiBlbF9wb3NpdGlvbi5sZWZ0XG5cdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXG5cdExBU1RfSUQgPSBpbWFnZV9pZFxuXHRyZXR1cm5cblxuXG4jIyNcbiAgIEF0dGFjaCBFdmVudHMgdG8gbW91c2VlbnRlciBhbmQgbW91c2VsZWF2ZVxuIyMjXG5cbiQkKCcudmNhLXByZXZpZXctbGluaycpLm9uIFwibW91c2VlbnRlclwiLCAtPlxuXHQkdGhpcyA9ICQodGhpcylcblx0aW1hZ2VfaGFzaCA9ICR0aGlzLnRleHQoKVxuXG5cdCMgVXNlIFJlZ2V4IHRvIGdldCBvbmx5IG51bWJlcnMgZnJvbSBpbWFnZV9oYXNoXG5cdGltYWdlX2lkID0gaW1hZ2VfaGFzaC5yZXBsYWNlIC9bXjAtOV0vZywgJydcblxuXHRzaG93X2ltYWdlX3ByZXZpZXcoIGltYWdlX2lkLCAkdGhpcyApXG5cbiQkKCcudmNhLXByZXZpZXctbGluaycpLm9uIFwibW91c2VsZWF2ZVwiLCBoaWRlX2ltYWdlX3ByZXZpZXciLCJcbiMgVGhlcmUgbXVzdCBiZSBhbiBBSkFYIFVSTFxuaWYgbm90IHdpbmRvdy5hamF4X29iamVjdD8gb3Igbm90IHdpbmRvdy5hamF4X29iamVjdC5hamF4X3VybD9cblx0aWYgY29uc29sZT8gYW5kIGNvbnNvbGUubG9nP1xuXHRcdHRocm93IG5ldyBFcnJvciBcIkFqYXggT2JqZWN0IGlzIHJlcXVpcmVkIGZvciBWaWxsYWdlIENsaWVudCBBcmVhXCJcblx0XHRyZXR1cm5cblxuaW1hZ2Vfc3RhdGVfY2hhbmdlID0gKCAkdGhpcywgaXNfc2VsZWN0ZWQgKSAtPlxuXHRpZiBpc19zZWxlY3RlZCBpcyAwXG5cdFx0IyBEZXNlbGVjdFxuXHRcdCR0aGlzLnJlbW92ZUNsYXNzKCdpcy1zZWxlY3RlZCcpXG5cdGVsc2Vcblx0XHQjIFNlbGVjdFxuXHRcdCR0aGlzLmFkZENsYXNzKCdpcy1zZWxlY3RlZCcpXG5cbmltYWdlX3N0YXRlX2Vycm9yID0gKCAkdGhpcywgaXNfc2VsZWN0ZWQgKSAtPlxuXG5cdCMgUmV2ZXJ0IGlzX3NlbGVjdGVkIHZhbHVlXG5cdGlzX3NlbGVjdGVkID0gaWYgKCBpc19zZWxlY3RlZCBpcyAwICkgdGhlbiAxIGVsc2UgMFxuXG5cdCMgUmV2ZXJ0IHN0YXRlXG5cdGltYWdlX3N0YXRlX2NoYW5nZSggJHRoaXMsIGlzX3NlbGVjdGVkIClcblxuXHQjIFRyaWdnZXIgRXJyb3Jcblx0ZGlzcGxheV9lcnJvcl9tZXNzYWdlKCAkdGhpcyApXG5cblxuZGlzcGxheV9lcnJvcl9tZXNzYWdlID0gKCAkZWwgKSAtPlxuXHQjIFRyeSBnZXR0aW5nIGFuIGltYWdlIElEXG5cdGltYWdlX2lkID0gJGVsLmRhdGEoJ2ltYWdlSWQnKVxuXG5cdCMgV2UgbmVlZCBzb21lIGZvcm0gb2YgSUQ6XG5cdGlmIG5vdCBpbWFnZV9pZFxuXHRcdGltYWdlX2lkID0gMFxuXG5cdCRlcnJvciA9ICQkKCcudmNhLWVycm9yX19tZXNzYWdlLmpzX190ZW1wbGF0ZScpXG5cdFx0LmNsb25lKClcblx0XHQucmVtb3ZlQ2xhc3MoJ2pzX190ZW1wbGF0ZScpXG5cblx0dGV4dCA9ICRlcnJvci50ZXh0KClcblx0dGV4dCA9IHRleHQucmVwbGFjZSgnIyNpbWFnZV9pZCMjJywgXCIjI3tpbWFnZV9pZH1cIilcblx0JGVycm9yLnRleHQoIHRleHQgKVxuXG5cblx0JGVycm9yXG5cdFx0LmNzcygnb3BhY2l0eScsIDApXG5cdFx0LmFwcGVuZFRvKCAkJCgnLnZjYS1lcnJvcl9fY29udGFpbmVyJykgKVxuXHRcdC52ZWxvY2l0eVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0dHJhbnNsYXRlWTogWzAsIDEwXVxuXHRcdFx0XHRvcGFjaXR5OiBbMSwgMF1cblx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdGR1cmF0aW9uOiA2MDBcblxuXHQkZXJyb3IudmVsb2NpdHlcblx0XHRwcm9wZXJ0aWVzOiAnZmFkZU91dCdcblx0XHRvcHRpb25zOlxuXHRcdFx0ZHVyYXRpb246IDIwMDBcblx0XHRcdGRlbGF5OiAzMDAwXG5cdFx0XHRlYXNpbmc6ICdlYXNlSW5PdXRRdWFkJ1xuXHRcdFx0Y29tcGxldGU6IC0+XG5cdFx0XHRcdCRlcnJvci5yZW1vdmUoKVxuXHRcdFx0XHQkZXJyb3IgPSBudWxsXG5cdFx0XHRcdHJldHVyblxuXG5cbiMjI1xuICAgIEF0dGFjaCBFdmVudHMgdG8gLmltYWdlLW1ldGFcbiMjI1xuJCgnLnZjYS1pbWFnZSAuaW1hZ2UtbWV0YScpLm9uICdjbGljaycsIC0+XG5cblx0JHRoaXMgPSAkKHRoaXMpXG5cdGltYWdlX2lkID0gJHRoaXMuZGF0YSgnaW1hZ2VJZCcpXG5cblx0aWYgbm90IGltYWdlX2lkXG5cdFx0Y29uc29sZS5sb2cgXCJBSkFYIEVycm9yOiBDYW4ndCBzZWxlY3QvdW5zZWxlY3QgYW4gaW1hZ2Ugd2l0aG91dCBhbiBJRFwiXG5cdFx0cmV0dXJuXG5cblx0aXNfc2VsZWN0ZWQgPSBpZiAoIG5vdCAkdGhpcy5pcygnLmlzLXNlbGVjdGVkJykgKSB0aGVuIDEgZWxzZSAwXG5cblx0JHRoaXMuYWRkQ2xhc3MoJ2lzLWxvYWRpbmcnKVxuXG5cdGRhdGEgPVxuXHRcdGFjdGlvbjogJ3ZjYV9zYXZlX3N0YXRlJ1xuXHRcdGF0dGFjaG1lbnRfaWQ6IGltYWdlX2lkXG5cdFx0YXR0YWNobWVudF9zdGF0ZTogaXNfc2VsZWN0ZWRcblxuXHRyZXF1ZXN0ID1cblx0XHR0eXBlOiAnUE9TVCdcblx0XHR1cmw6IGFqYXhfb2JqZWN0LmFqYXhfdXJsXG5cdFx0ZGF0YTogZGF0YVxuXHRcdGRhdGFUeXBlOiAnanNvbidcblx0XHRzdWNjZXNzOiAocikgLT5cblx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKCdpcy1sb2FkaW5nJylcblxuXHQkZGZkID0gJC5hamF4KHJlcXVlc3QpXG5cdGltYWdlX3N0YXRlX2NoYW5nZSgkdGhpcywgaXNfc2VsZWN0ZWQpXG5cblx0JGRmZC5mYWlsIC0+XG5cdFx0aW1hZ2Vfc3RhdGVfZXJyb3IoJHRoaXMsIGlzX3NlbGVjdGVkKSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==