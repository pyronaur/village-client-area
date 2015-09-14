
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
  var __$INPUT, __$TARGETS, __DATA, __PREVIOUS_VALUE, destroy, do_filter, find_matches, initialize, parse_links, reset_input_state, throttled_filter;

  __$TARGETS = null;

  __$INPUT = null;

  __DATA = null;

  __PREVIOUS_VALUE = "";

  parse_links = function() {
    var index;
    index = [];
    __$TARGETS.each(function(key, el) {
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

  do_filter = function(e) {
    var except, i, len, matches, ref, val, value;
    val = __$INPUT.val();
    if (val === __PREVIOUS_VALUE) {
      return;
    }
    __PREVIOUS_VALUE = val;
    if (val.length < 1) {
      __$TARGETS.css('display', '');
      $$('.masonry').masonry();
      return;
    }

    /*
    		Find matches
     */
    matches = __DATA;
    ref = val.split(" ");
    for (i = 0, len = ref.length; i < len; i++) {
      value = ref[i];
      matches = find_matches(matches, new RegExp(value, "i"));
    }
    if (matches.length > 0) {
      except = _.pluck(matches, 'el');
      __$TARGETS.css('display', '').not(except).css('display', 'none');
      __$INPUT.removeClass('not-found');
    } else {
      __$TARGETS.css('display', '');
      __$INPUT.addClass('not-found');
    }
    return $$('.masonry').masonry();
  };

  throttled_filter = _.throttle(do_filter, 750);

  reset_input_state = function(e) {
    return __$INPUT.removeClass('not-found');
  };

  destroy = function() {
    __$INPUT = $('#js__filter-input');
    if (__$INPUT.length !== 1) {
      return;
    }
    __$INPUT.off('keyup', throttled_filter);
    __$INPUT.off('blur', reset_input_state);
    __$TARGETS = null;
    __$INPUT = null;
    __DATA = null;
    return __PREVIOUS_VALUE = "";
  };

  initialize = function() {
    __$INPUT = $('#js__filter-input');
    if (__$INPUT.length !== 1) {
      return;
    }
    __$TARGETS = $('.js__filter_element');
    __DATA = parse_links();
    __$INPUT.on('keyup', throttled_filter);
    return __$INPUT.on('blur', reset_input_state);
  };

  $(document).ready(initialize);

  Hooks.addAction('client.init', initialize);

  Hooks.addAction('client.destroy', destroy);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudF9maWx0ZXJfZmF2b3JpdGVzLmNvZmZlZSIsImNsaWVudF9wcmV2aWV3LmNvZmZlZSIsImNsaWVudF9zZWFyY2guY29mZmVlIiwiY2xpZW50X3NlbGVjdF9pbWFnZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTTs7OzBCQUVMLE1BQUEsR0FBUSxTQUFBO2FBQ1AsRUFBQSxDQUFHLGNBQUgsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixRQUEzQjtJQURPOzswQkFHUixRQUFBLEdBQVUsU0FBQTtNQUNULElBQUMsQ0FBQSxHQUFELENBQUE7TUFFQSxFQUFBLENBQUcsV0FBSCxDQUNDLENBQUMsTUFERixDQUNTLFNBQUE7ZUFBSSxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLGNBQWIsQ0FBNEIsQ0FBQyxNQUE3QixLQUF5QztNQUE3QyxDQURULENBRUMsQ0FBQyxHQUZGLENBRU0sU0FGTixFQUVpQixNQUZqQjthQUlBLElBQUMsQ0FBQSxNQUFELENBQUE7SUFQUzs7MEJBU1YsVUFBQSxHQUFZLFNBQUE7TUFDWCxJQUFDLENBQUEsR0FBRCxDQUFBO01BQ0EsRUFBQSxDQUFHLFdBQUgsQ0FDQyxDQUFDLE1BREYsQ0FDUyxTQUFBO2VBQUksQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxjQUFiLENBQTRCLENBQUMsTUFBN0IsS0FBdUM7TUFBM0MsQ0FEVCxDQUVDLENBQUMsR0FGRixDQUVNLFNBRk4sRUFFaUIsTUFGakI7YUFJQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBTlc7OzBCQVFaLEdBQUEsR0FBSyxTQUFBO01BQ0osRUFBQSxDQUFHLFdBQUgsQ0FBZSxDQUFDLEdBQWhCLENBQW9CLFNBQXBCLEVBQStCLEVBQS9CO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUZJOzs7Ozs7RUFJTixPQUFBLEdBQVUsSUFBSTs7RUFFZCxFQUFBLENBQUcsZ0JBQUgsQ0FBb0IsQ0FB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OztJQU9ELElBQUEsR0FBTyxDQUFDLENBQUMsSUFBRixDQUFPLE9BQVA7SUFDUCxrQkFBQSxDQUFtQixLQUFuQixFQUEwQixXQUExQjtXQUVBLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBQTthQUNULGlCQUFBLENBQWtCLEtBQWxCLEVBQXlCLFdBQXpCO0lBRFMsQ0FBVjtFQTdCMEMsQ0FBM0M7QUFuRUEiLCJmaWxlIjoiY2xpZW50LWFyZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBWQ0FfRmlsdGVyc1xuXG5cdHJlbG9hZDogLT5cblx0XHQkJCgnLmpzX19tYXNvbnJ5JykubWFzb25yeSgnbGF5b3V0JylcblxuXHRzZWxlY3RlZDogLT5cblx0XHRAYWxsKClcblxuXHRcdCQkKCcuY2EtaW1hZ2UnKVxuXHRcdFx0LmZpbHRlcigtPiAoJCh0aGlzKS5maW5kKCcuaXMtc2VsZWN0ZWQnKS5sZW5ndGggaXNudCAxKSlcblx0XHRcdC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpXG5cblx0XHRAcmVsb2FkKClcblxuXHR1bnNlbGVjdGVkOiAtPlxuXHRcdEBhbGwoKVxuXHRcdCQkKCcuY2EtaW1hZ2UnKVxuXHRcdFx0LmZpbHRlcigtPiAoJCh0aGlzKS5maW5kKCcuaXMtc2VsZWN0ZWQnKS5sZW5ndGggaXMgMSkpXG5cdFx0XHQuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxuXG5cdFx0QHJlbG9hZCgpXG5cblx0YWxsOiAtPlxuXHRcdCQkKCcuY2EtaW1hZ2UnKS5jc3MoJ2Rpc3BsYXknLCAnJylcblx0XHRAcmVsb2FkKClcblxuZmlsdGVycyA9IG5ldyBWQ0FfRmlsdGVyc1xuXG4kJCgnLmpzX19jYS1hY3Rpb24nKS5vbiAnY2xpY2snLCAtPlxuXG5cdCMgU2V0dXBcblx0JHRoaXMgPSAkKHRoaXMpXG5cdGFjdGlvbiA9ICR0aGlzLmRhdGEoJ2FjdGlvbicpXG5cblx0IyBXZSBuZWVkIGFuIGFjdGlvblxuXHRyZXR1cm4gaWYgbm90IGFjdGlvblxuXG5cdCQkKCcuanNfX2NhLWFjdGlvbicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKVxuXHQkdGhpcy5hZGRDbGFzcygnaXMtYWN0aXZlJylcblxuXHRmaWx0ZXJzW2FjdGlvbl0oKVxuXG5cbiIsIlxuXG5cbnJldHVybiBpZiAkJCgnI2NhLXByZXZpZXcnKS5sZW5ndGggaXNudCAxXG5cblxuTEFTVF9JRCA9IC0xXG5Ib29rcy5hZGRBY3Rpb24gJ3RoZW1lLnJlc2l6ZWQnLCAtPlxuXHRMQVNUX0lEID0gLTFcblx0cmV0dXJuXG5cbmhpZGVfaW1hZ2VfcHJldmlldyA9IC0+XG5cdCQkKCcjY2EtcHJldmlldycpLmNzcygnZGlzcGxheScsICdub25lJylcblxuc2hvd19pbWFnZV9wcmV2aWV3ID0gKCBpbWFnZV9pZCwgJGVsICkgLT5cblx0JGltYWdlX2NvbnRhaW5lciA9ICQkKFwiI2NhLWltYWdlLSN7aW1hZ2VfaWR9XCIpXG5cblx0IyBXZSBuZWVkIG9ubHkgMSBpbWFnZS4gTm90IDAsIG5vdCA1LlxuXHRyZXR1cm4gaWYgJGltYWdlX2NvbnRhaW5lci5sZW5ndGggaXNudCAxXG5cblx0IyBJZiB0aGUgaW1hZ2UgaXMgYWxyZWFkeSB0aGVyZSwgZG9uJ3QgcmUtZG8gYWxsIHRoZSBET00gbW9kaWZpY2F0aW9uXG5cdGlmIExBU1RfSUQgaXMgaW1hZ2VfaWRcblx0XHQkJCgnI2NhLXByZXZpZXcnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKVxuXHRcdHJldHVyblxuXG5cblx0JGltYWdlID0gJGltYWdlX2NvbnRhaW5lci5maW5kKCdpbWcnKVxuXHQkJCgnI2NhLXByZXZpZXctY29udGVudCcpLmh0bWwoJGltYWdlLmNsb25lKCkpXG5cblx0ZWxfcG9zaXRpb24gPSAkZWwub2Zmc2V0KClcblx0ZWxfaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KClcblxuXHQkJCgnI2NhLXByZXZpZXcnKS5jc3Ncblx0XHR0b3A6IGVsX3Bvc2l0aW9uLnRvcCArIGVsX2hlaWdodCArIDJcblx0XHRsZWZ0OiBlbF9wb3NpdGlvbi5sZWZ0XG5cdFx0ZGlzcGxheTogJ2Jsb2NrJ1xuXG5cdExBU1RfSUQgPSBpbWFnZV9pZFxuXHRyZXR1cm5cblxuXG4jIyNcbiAgIEF0dGFjaCBFdmVudHMgdG8gbW91c2VlbnRlciBhbmQgbW91c2VsZWF2ZVxuIyMjXG5cbiQkKCcuY2EtcHJldmlldy1saW5rJykub24gXCJtb3VzZWVudGVyXCIsIC0+XG5cdCR0aGlzID0gJCh0aGlzKVxuXHRpbWFnZV9oYXNoID0gJHRoaXMudGV4dCgpXG5cblx0IyBVc2UgUmVnZXggdG8gZ2V0IG9ubHkgbnVtYmVycyBmcm9tIGltYWdlX2hhc2hcblx0aW1hZ2VfaWQgPSBpbWFnZV9oYXNoLnJlcGxhY2UgL1teMC05XS9nLCAnJ1xuXG5cdHNob3dfaW1hZ2VfcHJldmlldyggaW1hZ2VfaWQsICR0aGlzIClcblxuJCQoJy5jYS1wcmV2aWV3LWxpbmsnKS5vbiBcIm1vdXNlbGVhdmVcIiwgaGlkZV9pbWFnZV9wcmV2aWV3IiwiXG5cbl9fJFRBUkdFVFMgPSBudWxsXG5fXyRJTlBVVCA9IG51bGxcbl9fREFUQSA9IG51bGxcblxuIyBLZWVwIHRyYWNrIG9mIHZhbHVlIHRvIGF2b2lkIGR1cGxpY2F0aW9uXG5fX1BSRVZJT1VTX1ZBTFVFID0gXCJcIlxuXG5cbnBhcnNlX2xpbmtzID0gLT5cblx0aW5kZXggPSBbXVxuXG5cdF9fJFRBUkdFVFMuZWFjaCAoIGtleSwgZWwgKSAtPlxuXHRcdCRlbCA9ICQoZWwpXG5cdFx0JHRpdGxlID0gJGVsLmZpbmQoJy5qc19fZmlsdGVyX3NyYycpXG5cblx0XHR0aXRsZSA9ICR0aXRsZS50ZXh0KClcblxuXHRcdGluZGV4LnB1c2hcblx0XHRcdGlkOiAkZWwuYXR0cignaWQnKVxuXHRcdFx0dGl0bGU6IHRpdGxlXG5cdFx0XHRlbDogJGVsLmdldCgwKVxuXG5cdHJldHVybiBpbmRleFxuXG5cbmZpbmRfbWF0Y2hlcyA9ICggc291cmNlLCBrZXl3b3JkICkgLT5cblx0bWF0Y2hlcyA9IFtdXG5cblxuXHRmb3IgaXRlbSBpbiBzb3VyY2Vcblx0XHRpZiBrZXl3b3JkLnRlc3QoIGl0ZW0udGl0bGUgKVxuXHRcdFx0bWF0Y2hlcy5wdXNoIGl0ZW1cblxuXHRyZXR1cm4gbWF0Y2hlc1xuXG5cblxuXG5cbmRvX2ZpbHRlciA9IChlKSAtPlxuXHR2YWwgPSBfXyRJTlBVVC52YWwoKVxuXG5cdHJldHVybiBpZiB2YWwgaXMgX19QUkVWSU9VU19WQUxVRVxuXHRfX1BSRVZJT1VTX1ZBTFVFID0gdmFsXG5cblx0IyBXZSBuZWVkIHNvbWV0aGluZyB0byBzZWFyY2ggZm9yXG5cdGlmIHZhbC5sZW5ndGggPCAxXG5cdFx0X18kVEFSR0VUUy5jc3MgJ2Rpc3BsYXknLCAnJ1xuXHRcdCQkKCcubWFzb25yeScpLm1hc29ucnkoKVxuXHRcdHJldHVyblxuXG5cdCMjI1xuXHRcdEZpbmQgbWF0Y2hlc1xuXHQjIyNcblx0bWF0Y2hlcyA9IF9fREFUQVxuXG5cdGZvciB2YWx1ZSBpbiB2YWwuc3BsaXQoXCIgXCIpXG5cdFx0bWF0Y2hlcyA9IGZpbmRfbWF0Y2hlcyggbWF0Y2hlcywgbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpIClcblxuXHRpZiBtYXRjaGVzLmxlbmd0aCA+IDBcblx0XHQjIERvIHRoZSBmaWx0ZXJpbmcgdGhpbmdcblx0XHRleGNlcHQgPSBfLnBsdWNrKG1hdGNoZXMsICdlbCcpXG5cdFx0X18kVEFSR0VUU1xuXHRcdFx0LmNzcyAnZGlzcGxheScsICcnXG5cdFx0XHQubm90KCBleGNlcHQgKVxuXHRcdFx0LmNzcyAnZGlzcGxheScsICdub25lJ1xuXG5cdFx0X18kSU5QVVQucmVtb3ZlQ2xhc3MoJ25vdC1mb3VuZCcpXG5cdGVsc2Vcblx0XHQjIE5vdCBGb3VuZFxuXHRcdF9fJFRBUkdFVFMuY3NzICdkaXNwbGF5JywgJydcblx0XHRfXyRJTlBVVC5hZGRDbGFzcygnbm90LWZvdW5kJylcblxuXHQkJCgnLm1hc29ucnknKS5tYXNvbnJ5KClcblxudGhyb3R0bGVkX2ZpbHRlciA9IF8udGhyb3R0bGUoIGRvX2ZpbHRlciwgNzUwIClcblxucmVzZXRfaW5wdXRfc3RhdGUgPSAoZSkgLT5cblx0X18kSU5QVVQucmVtb3ZlQ2xhc3MoJ25vdC1mb3VuZCcpXG5cbmRlc3Ryb3kgPSAtPlxuXHRfXyRJTlBVVCA9ICQoJyNqc19fZmlsdGVyLWlucHV0JylcblxuXHQjIFdlIG11c3QgaGF2ZSBmaWx0ZXJzIHRvIGRvIG91ciB0aGluZ1xuXHRyZXR1cm4gaWYgX18kSU5QVVQubGVuZ3RoIGlzbnQgMVxuXG5cdCMgUmVtb3ZlIEV2ZW50c1xuXHRfXyRJTlBVVC5vZmYgJ2tleXVwJywgdGhyb3R0bGVkX2ZpbHRlclxuXHRfXyRJTlBVVC5vZmYgJ2JsdXInLCByZXNldF9pbnB1dF9zdGF0ZVxuXG5cdCMgQ2xlYXIgdmFyc1xuXHRfXyRUQVJHRVRTID0gbnVsbFxuXHRfXyRJTlBVVCA9IG51bGxcblx0X19EQVRBID0gbnVsbFxuXHRfX1BSRVZJT1VTX1ZBTFVFID0gXCJcIlxuXG5cbmluaXRpYWxpemUgPSAtPlxuXHRfXyRJTlBVVCA9ICQoJyNqc19fZmlsdGVyLWlucHV0JylcblxuXHQjIFdlIG11c3QgaGF2ZSBmaWx0ZXJzIHRvIGRvIG91ciB0aGluZ1xuXHRyZXR1cm4gaWYgX18kSU5QVVQubGVuZ3RoIGlzbnQgMVxuXG5cdF9fJFRBUkdFVFMgPSAkKCcuanNfX2ZpbHRlcl9lbGVtZW50Jylcblx0X19EQVRBID0gcGFyc2VfbGlua3MoKVxuXG5cdF9fJElOUFVULm9uICdrZXl1cCcsIHRocm90dGxlZF9maWx0ZXJcblx0X18kSU5QVVQub24gJ2JsdXInLCByZXNldF9pbnB1dF9zdGF0ZVxuXG5cbiQoZG9jdW1lbnQpLnJlYWR5IGluaXRpYWxpemVcblxuSG9va3MuYWRkQWN0aW9uICdjbGllbnQuaW5pdCcsIGluaXRpYWxpemVcbkhvb2tzLmFkZEFjdGlvbiAnY2xpZW50LmRlc3Ryb3knLCBkZXN0cm95IiwiXG4jIFRoZXJlIG11c3QgYmUgYW4gQUpBWCBVUkxcbmlmIG5vdCB3aW5kb3cuYWpheF9vYmplY3Q/IG9yIG5vdCB3aW5kb3cuYWpheF9vYmplY3QuYWpheF91cmw/XG5cdGlmIGNvbnNvbGU/IGFuZCBjb25zb2xlLmxvZz9cblx0XHR0aHJvdyBuZXcgRXJyb3IgXCJBamF4IE9iamVjdCBpcyByZXF1aXJlZCBmb3IgVmlsbGFnZSBDbGllbnQgQXJlYVwiXG5cdFx0cmV0dXJuXG5cbmltYWdlX3N0YXRlX2NoYW5nZSA9ICggJHRoaXMsIGlzX3NlbGVjdGVkICkgLT5cblx0aWYgaXNfc2VsZWN0ZWQgaXMgMFxuXHRcdCMgRGVzZWxlY3Rcblx0XHQkdGhpcy5yZW1vdmVDbGFzcygnaXMtc2VsZWN0ZWQnKVxuXHRlbHNlXG5cdFx0IyBTZWxlY3Rcblx0XHQkdGhpcy5hZGRDbGFzcygnaXMtc2VsZWN0ZWQnKVxuXG5pbWFnZV9zdGF0ZV9lcnJvciA9ICggJHRoaXMsIGlzX3NlbGVjdGVkICkgLT5cblxuXHQjIFJldmVydCBpc19zZWxlY3RlZCB2YWx1ZVxuXHRpc19zZWxlY3RlZCA9IGlmICggaXNfc2VsZWN0ZWQgaXMgMCApIHRoZW4gMSBlbHNlIDBcblxuXHQjIFJldmVydCBzdGF0ZVxuXHRpbWFnZV9zdGF0ZV9jaGFuZ2UoICR0aGlzLCBpc19zZWxlY3RlZCApXG5cblx0IyBUcmlnZ2VyIEVycm9yXG5cdGRpc3BsYXlfZXJyb3JfbWVzc2FnZSggJHRoaXMgKVxuXG5cbmRpc3BsYXlfZXJyb3JfbWVzc2FnZSA9ICggJGVsICkgLT5cblx0IyBUcnkgZ2V0dGluZyBhbiBpbWFnZSBJRFxuXHRpbWFnZV9pZCA9ICRlbC5kYXRhKCdpbWFnZUlkJylcblxuXHQjIFdlIG5lZWQgc29tZSBmb3JtIG9mIElEOlxuXHRpZiBub3QgaW1hZ2VfaWRcblx0XHRpbWFnZV9pZCA9IDBcblxuXHQkZXJyb3IgPSAkJCgnLmNhLWVycm9yX19tZXNzYWdlLmpzX190ZW1wbGF0ZScpXG5cdFx0LmNsb25lKClcblx0XHQucmVtb3ZlQ2xhc3MoJ2pzX190ZW1wbGF0ZScpXG5cblx0dGV4dCA9ICRlcnJvci50ZXh0KClcblx0dGV4dCA9IHRleHQucmVwbGFjZSgnIyNpbWFnZV9pZCMjJywgXCIjI3tpbWFnZV9pZH1cIilcblx0JGVycm9yLnRleHQoIHRleHQgKVxuXG5cblx0JGVycm9yXG5cdFx0LmNzcygnb3BhY2l0eScsIDApXG5cdFx0LmFwcGVuZFRvKCAkJCgnLmNhLWVycm9yX19jb250YWluZXInKSApXG5cdFx0LnZlbG9jaXR5XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR0cmFuc2xhdGVZOiBbMCwgMTBdXG5cdFx0XHRcdG9wYWNpdHk6IFsxLCAwXVxuXHRcdFx0b3B0aW9uczpcblx0XHRcdFx0ZHVyYXRpb246IDYwMFxuXG5cdCRlcnJvci52ZWxvY2l0eVxuXHRcdHByb3BlcnRpZXM6ICdmYWRlT3V0J1xuXHRcdG9wdGlvbnM6XG5cdFx0XHRkdXJhdGlvbjogMjAwMFxuXHRcdFx0ZGVsYXk6IDMwMDBcblx0XHRcdGVhc2luZzogJ2Vhc2VJbk91dFF1YWQnXG5cdFx0XHRjb21wbGV0ZTogLT5cblx0XHRcdFx0JGVycm9yLnJlbW92ZSgpXG5cdFx0XHRcdCRlcnJvciA9IG51bGxcblx0XHRcdFx0cmV0dXJuXG5cblxuIyMjXG4gICAgQXR0YWNoIEV2ZW50cyB0byAuaW1hZ2UtbWV0YVxuIyMjXG4kKCcuY2EtaW1hZ2UgLmNhLWltYWdlX19tZXRhJykub24gJ2NsaWNrJywgLT5cblxuXHQkdGhpcyA9ICQodGhpcylcblx0aW1hZ2VfaWQgPSAkdGhpcy5kYXRhKCdpbWFnZUlkJylcblxuXHRpZiBub3QgaW1hZ2VfaWRcblx0XHRjb25zb2xlLmxvZyBcIkFKQVggRXJyb3I6IENhbid0IHNlbGVjdC91bnNlbGVjdCBhbiBpbWFnZSB3aXRob3V0IGFuIElEXCJcblx0XHRyZXR1cm5cblxuXHRpc19zZWxlY3RlZCA9IGlmICggbm90ICR0aGlzLmlzKCcuaXMtc2VsZWN0ZWQnKSApIHRoZW4gMSBlbHNlIDBcblxuXHQkdGhpcy5hZGRDbGFzcygnaXMtbG9hZGluZycpXG5cblx0ZGF0YSA9XG5cdFx0YWN0aW9uOiAndmNhX3NhdmVfc3RhdGUnXG5cdFx0YXR0YWNobWVudF9pZDogaW1hZ2VfaWRcblx0XHRhdHRhY2htZW50X3N0YXRlOiBpc19zZWxlY3RlZFxuXG5cdHJlcXVlc3QgPVxuXHRcdHR5cGU6ICdQT1NUJ1xuXHRcdHVybDogYWpheF9vYmplY3QuYWpheF91cmxcblx0XHRkYXRhOiBkYXRhXG5cdFx0ZGF0YVR5cGU6ICdqc29uJ1xuXHRcdHN1Y2Nlc3M6IChyKSAtPlxuXHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoJ2lzLWxvYWRpbmcnKVxuXG5cdCRkZmQgPSAkLmFqYXgocmVxdWVzdClcblx0aW1hZ2Vfc3RhdGVfY2hhbmdlKCR0aGlzLCBpc19zZWxlY3RlZClcblxuXHQkZGZkLmZhaWwgLT5cblx0XHRpbWFnZV9zdGF0ZV9lcnJvcigkdGhpcywgaXNfc2VsZWN0ZWQpIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9