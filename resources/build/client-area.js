
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
      $$('.ca-image').filter(function() {
        return $(this).find('.is-selected').length !== 1;
      }).css('display', 'none');
      return this.reload();
    };

    VCA_Filters.prototype.unselected = function() {
      this.all();
      $$('.ca-image').filter(function() {
        return $(this).find('.is-selected').length === 1;
      }).css('display', 'none');
      return this.reload();
    };

    VCA_Filters.prototype.all = function() {
      $$('.ca-image').css('display', '');
      return this.reload();
    };

    return VCA_Filters;

  })();

  filters = new VCA_Filters;

  $$('.js__ca-action').on('click', function() {
    var $this, action;
    $this = $(this);
    action = $this.data('action');
    if (!action) {
      return;
    }
    $$('.js__ca-action').removeClass('is-active');
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

  if ($$('#ca-preview').length !== 1) {
    return;
  }

  LAST_ID = -1;

  Hooks.addAction('theme.resized', function() {
    LAST_ID = -1;
  });

  hide_image_preview = function() {
    return $$('#ca-preview').css('display', 'none');
  };

  show_image_preview = function(image_id, $el) {
    var $image, $image_container, el_height, el_position;
    $image_container = $$("#ca-image-" + image_id);
    if ($image_container.length !== 1) {
      return;
    }
    if (LAST_ID === image_id) {
      $$('#ca-preview').css('display', 'block');
      return;
    }
    $image = $image_container.find('img');
    $$('#ca-preview-content').html($image.clone());
    el_position = $el.offset();
    el_height = $el.outerHeight();
    $$('#ca-preview').css({
      top: el_position.top + el_height + 2,
      left: el_position.left,
      display: 'block'
    });
    LAST_ID = image_id;
  };


  /*
     Attach Events to mouseenter and mouseleave
   */

  $$('.ca-preview-link').on("mouseenter", function() {
    var $this, image_hash, image_id;
    $this = $(this);
    image_hash = $this.text();
    image_id = image_hash.replace(/[^0-9]/g, '');
    return show_image_preview(image_id, $this);
  });

  $$('.ca-preview-link').on("mouseleave", hide_image_preview);

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
    $error = $$('.ca-error__message.js__template').clone().removeClass('js__template');
    text = $error.text();
    text = text.replace('##image_id##', "#" + image_id);
    $error.text(text);
    $error.css('opacity', 0).appendTo($$('.ca-error__container')).velocity({
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

  $('.ca-image .ca-image__meta').on('click', function() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudF9maWx0ZXJfZmF2b3JpdGVzLmNvZmZlZSIsImNsaWVudF9maWx0ZXJzLmNvZmZlZSIsImNsaWVudF9wcmV2aWV3LmNvZmZlZSIsImNsaWVudF9zZWxlY3RfaW1hZ2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU07OzswQkFFTCxNQUFBLEdBQVEsU0FBQTthQUNQLEVBQUEsQ0FBRyxjQUFILENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsUUFBM0I7SUFETzs7MEJBR1IsUUFBQSxHQUFVLFNBQUE7TUFDVCxJQUFDLENBQUEsR0FBRCxDQUFBO01BRUEsRUFBQSxDQUFHLFdBQUgsQ0FDQyxDQUFDLE1BREYsQ0FDUyxTQUFBO2VBQUksQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxjQUFiLENBQTRCLENBQUMsTUFBN0IsS0FBeUM7TUFBN0MsQ0FEVCxDQUVDLENBQUMsR0FGRixDQUVNLFNBRk4sRUFFaUIsTUFGakI7YUFJQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBUFM7OzBCQVNWLFVBQUEsR0FBWSxTQUFBO01BQ1gsSUFBQyxDQUFBLEdBQUQsQ0FBQTtNQUNBLEVBQUEsQ0FBRyxXQUFILENBQ0MsQ0FBQyxNQURGLENBQ1MsU0FBQTtlQUFJLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsY0FBYixDQUE0QixDQUFDLE1BQTdCLEtBQXVDO01BQTNDLENBRFQsQ0FFQyxDQUFDLEdBRkYsQ0FFTSxTQUZOLEVBRWlCLE1BRmpCO2FBSUEsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQU5XOzswQkFRWixHQUFBLEdBQUssU0FBQTtNQUNKLEVBQUEsQ0FBRyxXQUFILENBQWUsQ0FBQyxHQUFoQixDQUFvQixTQUFwQixFQUErQixFQUEvQjthQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7SUFGSTs7Ozs7O0VBSU4sT0FBQSxHQUFVLElBQUk7O0VBRWQsRUFBQSxDQUFHLGdCQUFILENBQW9CLENB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QUFJLFFBQVA7TUFDQyxPQUFPLENBQUMsR0FBUixDQUFZLDBEQUFaO0FBQ0EsYUFGRDs7SUFJQSxXQUFBLEdBQW1CLENBQUksS0FBSyxDQUFDLEVBQU4sQ0FBUyxjQUFULENBQVQsR0FBeUMsQ0FBekMsR0FBZ0Q7SUFFOUQsS0FBSyxDQUFDLFFBQU4sQ0FBZSxZQUFmO0lBRUEsSUFBQSxHQUNDO01BQUEsTUFBQSxFQUFRLGdCQUFSO01BQ0EsYUFBQSxFQUFlLFFBRGY7TUFFQSxnQkFBQSxFQUFrQixXQUZsQjs7SUFJRCxPQUFBLEdBQ0M7TUFBQSxJQUFBLEVBQU0sTUFBTjtNQUNBLEdBQUEsRUFBSyxXQUFXLENBQUMsUUFEakI7TUFFQSxJQUFBLEVBQU0sSUFGTjtNQUdBLFFBQUEsRUFBVSxNQUhWO01BSUEsT0FBQSxFQUFTLFNBQUMsQ0FBRDtlQUNSLEtBQUssQ0FBQyxXQUFOLENBQWtCLFlBQWxCO01BRFEsQ0FKVDs7SUFPRCxJQUFBLEdBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxPQUFQO0lBQ1Asa0JBQUEsQ0FBbUIsS0FBbkIsRUFBMEIsV0FBMUI7V0FFQSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQUE7YUFDVCxpQkFBQSxDQUFrQixLQUFsQixFQUF5QixXQUF6QjtJQURTLENBQVY7RUE3QjBDLENBQTNDO0FBbkVBIiwiZmlsZSI6ImNsaWVudC1hcmVhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgVkNBX0ZpbHRlcnNcblxuXHRyZWxvYWQ6IC0+XG5cdFx0JCQoJy5qc19fbWFzb25yeScpLm1hc29ucnkoJ2xheW91dCcpXG5cblx0c2VsZWN0ZWQ6IC0+XG5cdFx0QGFsbCgpXG5cblx0XHQkJCgnLmNhLWltYWdlJylcblx0XHRcdC5maWx0ZXIoLT4gKCQodGhpcykuZmluZCgnLmlzLXNlbGVjdGVkJykubGVuZ3RoIGlzbnQgMSkpXG5cdFx0XHQuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxuXG5cdFx0QHJlbG9hZCgpXG5cblx0dW5zZWxlY3RlZDogLT5cblx0XHRAYWxsKClcblx0XHQkJCgnLmNhLWltYWdlJylcblx0XHRcdC5maWx0ZXIoLT4gKCQodGhpcykuZmluZCgnLmlzLXNlbGVjdGVkJykubGVuZ3RoIGlzIDEpKVxuXHRcdFx0LmNzcygnZGlzcGxheScsICdub25lJylcblxuXHRcdEByZWxvYWQoKVxuXG5cdGFsbDogLT5cblx0XHQkJCgnLmNhLWltYWdlJykuY3NzKCdkaXNwbGF5JywgJycpXG5cdFx0QHJlbG9hZCgpXG5cbmZpbHRlcnMgPSBuZXcgVkNBX0ZpbHRlcnNcblxuJCQoJy5qc19fY2EtYWN0aW9uJykub24gJ2NsaWNrJywgLT5cblxuXHQjIFNldHVwXG5cdCR0aGlzID0gJCh0aGlzKVxuXHRhY3Rpb24gPSAkdGhpcy5kYXRhKCdhY3Rpb24nKVxuXG5cdCMgV2UgbmVlZCBhbiBhY3Rpb25cblx0cmV0dXJuIGlmIG5vdCBhY3Rpb25cblxuXHQkJCgnLmpzX19jYS1hY3Rpb24nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJylcblx0JHRoaXMuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpXG5cblx0ZmlsdGVyc1thY3Rpb25dKClcblxuXG4iLCIkaW5wdXQgPSAkKCcjanNfX2ZpbHRlci1pbnB1dCcpXG5cbiMgV2UgbXVzdCBoYXZlIGZpbHRlcnMgdG8gZG8gb3VyIHRoaW5nXG5yZXR1cm4gaWYgJGlucHV0Lmxlbmd0aCBpc250IDFcblxuJGZpbHRlcl90YXJnZXRzID0gJCgnLmpzX19maWx0ZXJfZWxlbWVudCcpXG5cbnBhcnNlX2xpbmtzID0gLT5cblx0aW5kZXggPSBbXVxuXG5cdCRmaWx0ZXJfdGFyZ2V0cy5lYWNoICgga2V5LCBlbCApIC0+XG5cdFx0JGVsID0gJChlbClcblx0XHQkdGl0bGUgPSAkZWwuZmluZCgnLmpzX19maWx0ZXJfc3JjJylcblxuXHRcdHRpdGxlID0gJHRpdGxlLnRleHQoKVxuXG5cdFx0aW5kZXgucHVzaFxuXHRcdFx0aWQ6ICRlbC5hdHRyKCdpZCcpXG5cdFx0XHR0aXRsZTogdGl0bGVcblx0XHRcdGVsOiAkZWwuZ2V0KDApXG5cblx0cmV0dXJuIGluZGV4XG5cblxuXG5cbkRBVEEgPSBwYXJzZV9saW5rcygpXG5cblxuXG5maW5kX21hdGNoZXMgPSAoIHNvdXJjZSwga2V5d29yZCApIC0+XG5cdG1hdGNoZXMgPSBbXVxuXG5cblx0Zm9yIGl0ZW0gaW4gc291cmNlXG5cdFx0aWYga2V5d29yZC50ZXN0KCBpdGVtLnRpdGxlIClcblx0XHRcdG1hdGNoZXMucHVzaCBpdGVtXG5cblx0cmV0dXJuIG1hdGNoZXNcblxuXG5cbiMgS2VlcCB0cmFjayBvZiB2YWx1ZSB0byBhdm9pZCBkdXBsaWNhdGlvblxucHJldmlvdXNfdmFsdWUgPSBcIlwiXG5cblxuXG5kb19maWx0ZXIgPSAoZSkgLT5cblx0dmFsID0gJGlucHV0LnZhbCgpXG5cblx0cmV0dXJuIGlmIHZhbCBpcyBwcmV2aW91c192YWx1ZVxuXHRwcmV2aW91c192YWx1ZSA9IHZhbFxuXG5cdCMgV2UgbmVlZCBzb21ldGhpbmcgdG8gc2VhcmNoIGZvclxuXHRpZiB2YWwubGVuZ3RoIDwgMVxuXHRcdCRmaWx0ZXJfdGFyZ2V0cy5jc3MgJ2Rpc3BsYXknLCAnJ1xuXHRcdCQkKCcubWFzb25yeScpLm1hc29ucnkoKVxuXHRcdHJldHVyblxuXG5cdCMjI1xuXHRcdEZpbmQgbWF0Y2hlc1xuXHQjIyNcblx0bWF0Y2hlcyA9IERBVEFcblxuXHRmb3IgdmFsdWUgaW4gdmFsLnNwbGl0KFwiIFwiKVxuXHRcdG1hdGNoZXMgPSBmaW5kX21hdGNoZXMoIG1hdGNoZXMsIG5ldyBSZWdFeHAodmFsdWUsIFwiaVwiKSApXG5cblx0aWYgbWF0Y2hlcy5sZW5ndGggPiAwXG5cdFx0IyBEbyB0aGUgZmlsdGVyaW5nIHRoaW5nXG5cdFx0ZXhjZXB0ID0gXy5wbHVjayhtYXRjaGVzLCAnZWwnKVxuXHRcdCRmaWx0ZXJfdGFyZ2V0c1xuXHRcdFx0LmNzcyAnZGlzcGxheScsICcnXG5cdFx0XHQubm90KCBleGNlcHQgKVxuXHRcdFx0LmNzcyAnZGlzcGxheScsICdub25lJ1xuXG5cdFx0JGlucHV0LnJlbW92ZUNsYXNzKCdub3QtZm91bmQnKVxuXHRlbHNlXG5cdFx0IyBOb3QgRm91bmRcblx0XHQkZmlsdGVyX3RhcmdldHMuY3NzICdkaXNwbGF5JywgJydcblx0XHQkaW5wdXQuYWRkQ2xhc3MoJ25vdC1mb3VuZCcpXG5cblx0JCQoJy5tYXNvbnJ5JykubWFzb25yeSgpXG5cblxuJGlucHV0Lm9uICdrZXl1cCcsIF8udGhyb3R0bGUoIGRvX2ZpbHRlciwgNzUwIClcbiRpbnB1dC5vbiAnYmx1cicsIC0+XG5cdCRpbnB1dC5yZW1vdmVDbGFzcygnbm90LWZvdW5kJylcblxuXG5cbiIsIlxuXG5cbnJldHVybiBpZiAkJCgnI2NhLXByZXZpZXcnKS5sZW5ndGggaXNudCAxXG5cblxuTEFTVF9JRCA9IC0xXG5Ib29rcy5hZGRBY3Rpb24gJ3RoZW1lLnJlc2l6ZWQnLCAtPlxuXHRMQVNUX0lEID0gLTFcblx0cmV0dXJuXG5cbmhpZGVfaW1hZ2VfcHJldmlldyA9IC0+XG5cdCQkKCcjY2EtcHJldmlldycpLmNzcygnZGlzcGxheScsICdub25lJylcblxuc2hvd19pbWFnZV9wcmV2aWV3ID0gKCBpbWFnZV9pZCwgJGVsICkgLT5cblx0JGltYWdlX2NvbnRhaW5lciA9ICQkKFwiI2NhLWltYWdlLSN7aW1hZ2VfaWR9XCIpXG5cblx0IyBXZSBuZWVkIG9ubHkgMSBpbWFnZS4gTm90IDAsIG5vdCA1LlxuXHRyZXR1cm4gaWYgJGltYWdlX2NvbnRhaW5lci5sZW5ndGggaXNudCAxXG5cblx0IyBJZiB0aGUgaW1hZ2UgaXMgYWxyZWFkeSB0aGVyZSwgZG9uJ3QgcmUtZG8gYWxsIHRoZSBET00gbW9kaWZpY2F0aW9uXG5cdGlmIExBU1RfSUQgaXMgaW1hZ2VfaWRcblx0XHQkJCgnI2NhLXByZXZpZXcnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKVxuXHRcdHJldHVyblxuXG5cblx0JGltYWdlID0gJGltYWdlX2NvbnRhaW5lci5maW5kKCdpbWcnKVxuXHQkJCgnI2NhLXByZXZpZXctY29udGVudCcpLmh0bWwoJGltYWdlLmNsb25lKCkpXG5cblx0ZWxfcG9zaXRpb24gPSAkZWwub2Zmc2V0KClcblx0ZWxfaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KClcblxuXHQkJCgnI2NhLXByZXZpZXcnKS5jc3Ncblx0XHR0b3A6IGVsX3Bvc2l0aW9uLnRvcCArIGVsX2hlaWdodCArIDJcblx0XHRsZWZ0OiBlbF9wb3NpdGlvbi5sZWZ0XG5cdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXG5cdExBU1RfSUQgPSBpbWFnZV9pZFxuXHRyZXR1cm5cblxuXG4jIyNcbiAgIEF0dGFjaCBFdmVudHMgdG8gbW91c2VlbnRlciBhbmQgbW91c2VsZWF2ZVxuIyMjXG5cbiQkKCcuY2EtcHJldmlldy1saW5rJykub24gXCJtb3VzZWVudGVyXCIsIC0+XG5cdCR0aGlzID0gJCh0aGlzKVxuXHRpbWFnZV9oYXNoID0gJHRoaXMudGV4dCgpXG5cblx0IyBVc2UgUmVnZXggdG8gZ2V0IG9ubHkgbnVtYmVycyBmcm9tIGltYWdlX2hhc2hcblx0aW1hZ2VfaWQgPSBpbWFnZV9oYXNoLnJlcGxhY2UgL1teMC05XS9nLCAnJ1xuXG5cdHNob3dfaW1hZ2VfcHJldmlldyggaW1hZ2VfaWQsICR0aGlzIClcblxuJCQoJy5jYS1wcmV2aWV3LWxpbmsnKS5vbiBcIm1vdXNlbGVhdmVcIiwgaGlkZV9pbWFnZV9wcmV2aWV3IiwiXG4jIFRoZXJlIG11c3QgYmUgYW4gQUpBWCBVUkxcbmlmIG5vdCB3aW5kb3cuYWpheF9vYmplY3Q/IG9yIG5vdCB3aW5kb3cuYWpheF9vYmplY3QuYWpheF91cmw/XG5cdGlmIGNvbnNvbGU/IGFuZCBjb25zb2xlLmxvZz9cblx0XHR0aHJvdyBuZXcgRXJyb3IgXCJBamF4IE9iamVjdCBpcyByZXF1aXJlZCBmb3IgVmlsbGFnZSBDbGllbnQgQXJlYVwiXG5cdFx0cmV0dXJuXG5cbmltYWdlX3N0YXRlX2NoYW5nZSA9ICggJHRoaXMsIGlzX3NlbGVjdGVkICkgLT5cblx0aWYgaXNfc2VsZWN0ZWQgaXMgMFxuXHRcdCMgRGVzZWxlY3Rcblx0XHQkdGhpcy5yZW1vdmVDbGFzcygnaXMtc2VsZWN0ZWQnKVxuXHRlbHNlXG5cdFx0IyBTZWxlY3Rcblx0XHQkdGhpcy5hZGRDbGFzcygnaXMtc2VsZWN0ZWQnKVxuXG5pbWFnZV9zdGF0ZV9lcnJvciA9ICggJHRoaXMsIGlzX3NlbGVjdGVkICkgLT5cblxuXHQjIFJldmVydCBpc19zZWxlY3RlZCB2YWx1ZVxuXHRpc19zZWxlY3RlZCA9IGlmICggaXNfc2VsZWN0ZWQgaXMgMCApIHRoZW4gMSBlbHNlIDBcblxuXHQjIFJldmVydCBzdGF0ZVxuXHRpbWFnZV9zdGF0ZV9jaGFuZ2UoICR0aGlzLCBpc19zZWxlY3RlZCApXG5cblx0IyBUcmlnZ2VyIEVycm9yXG5cdGRpc3BsYXlfZXJyb3JfbWVzc2FnZSggJHRoaXMgKVxuXG5cbmRpc3BsYXlfZXJyb3JfbWVzc2FnZSA9ICggJGVsICkgLT5cblx0IyBUcnkgZ2V0dGluZyBhbiBpbWFnZSBJRFxuXHRpbWFnZV9pZCA9ICRlbC5kYXRhKCdpbWFnZUlkJylcblxuXHQjIFdlIG5lZWQgc29tZSBmb3JtIG9mIElEOlxuXHRpZiBub3QgaW1hZ2VfaWRcblx0XHRpbWFnZV9pZCA9IDBcblxuXHQkZXJyb3IgPSAkJCgnLmNhLWVycm9yX19tZXNzYWdlLmpzX190ZW1wbGF0ZScpXG5cdFx0LmNsb25lKClcblx0XHQucmVtb3ZlQ2xhc3MoJ2pzX190ZW1wbGF0ZScpXG5cblx0dGV4dCA9ICRlcnJvci50ZXh0KClcblx0dGV4dCA9IHRleHQucmVwbGFjZSgnIyNpbWFnZV9pZCMjJywgXCIjI3tpbWFnZV9pZH1cIilcblx0JGVycm9yLnRleHQoIHRleHQgKVxuXG5cblx0JGVycm9yXG5cdFx0LmNzcygnb3BhY2l0eScsIDApXG5cdFx0LmFwcGVuZFRvKCAkJCgnLmNhLWVycm9yX19jb250YWluZXInKSApXG5cdFx0LnZlbG9jaXR5XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR0cmFuc2xhdGVZOiBbMCwgMTBdXG5cdFx0XHRcdG9wYWNpdHk6IFsxLCAwXVxuXHRcdFx0b3B0aW9uczpcblx0XHRcdFx0ZHVyYXRpb246IDYwMFxuXG5cdCRlcnJvci52ZWxvY2l0eVxuXHRcdHByb3BlcnRpZXM6ICdmYWRlT3V0J1xuXHRcdG9wdGlvbnM6XG5cdFx0XHRkdXJhdGlvbjogMjAwMFxuXHRcdFx0ZGVsYXk6IDMwMDBcblx0XHRcdGVhc2luZzogJ2Vhc2VJbk91dFF1YWQnXG5cdFx0XHRjb21wbGV0ZTogLT5cblx0XHRcdFx0JGVycm9yLnJlbW92ZSgpXG5cdFx0XHRcdCRlcnJvciA9IG51bGxcblx0XHRcdFx0cmV0dXJuXG5cblxuIyMjXG4gICAgQXR0YWNoIEV2ZW50cyB0byAuaW1hZ2UtbWV0YVxuIyMjXG4kKCcuY2EtaW1hZ2UgLmNhLWltYWdlX19tZXRhJykub24gJ2NsaWNrJywgLT5cblxuXHQkdGhpcyA9ICQodGhpcylcblx0aW1hZ2VfaWQgPSAkdGhpcy5kYXRhKCdpbWFnZUlkJylcblxuXHRpZiBub3QgaW1hZ2VfaWRcblx0XHRjb25zb2xlLmxvZyBcIkFKQVggRXJyb3I6IENhbid0IHNlbGVjdC91bnNlbGVjdCBhbiBpbWFnZSB3aXRob3V0IGFuIElEXCJcblx0XHRyZXR1cm5cblxuXHRpc19zZWxlY3RlZCA9IGlmICggbm90ICR0aGlzLmlzKCcuaXMtc2VsZWN0ZWQnKSApIHRoZW4gMSBlbHNlIDBcblxuXHQkdGhpcy5hZGRDbGFzcygnaXMtbG9hZGluZycpXG5cblx0ZGF0YSA9XG5cdFx0YWN0aW9uOiAndmNhX3NhdmVfc3RhdGUnXG5cdFx0YXR0YWNobWVudF9pZDogaW1hZ2VfaWRcblx0XHRhdHRhY2htZW50X3N0YXRlOiBpc19zZWxlY3RlZFxuXG5cdHJlcXVlc3QgPVxuXHRcdHR5cGU6ICdQT1NUJ1xuXHRcdHVybDogYWpheF9vYmplY3QuYWpheF91cmxcblx0XHRkYXRhOiBkYXRhXG5cdFx0ZGF0YVR5cGU6ICdqc29uJ1xuXHRcdHN1Y2Nlc3M6IChyKSAtPlxuXHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoJ2lzLWxvYWRpbmcnKVxuXG5cdCRkZmQgPSAkLmFqYXgocmVxdWVzdClcblx0aW1hZ2Vfc3RhdGVfY2hhbmdlKCR0aGlzLCBpc19zZWxlY3RlZClcblxuXHQkZGZkLmZhaWwgLT5cblx0XHRpbWFnZV9zdGF0ZV9lcnJvcigkdGhpcywgaXNfc2VsZWN0ZWQpIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9