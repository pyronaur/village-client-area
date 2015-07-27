(function() { 
 	"use strict";
	var $, $$, Hooks, App;
	$ = jQuery;
	$$ = $.q;
	App = {};
	Hooks = window.wp.hooks;
    (function() {
  window.Client_Gallery = App;

}).call(this);

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
    return;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbmRleC5jb2ZmZWUiLCJjbGllbnRfZmlsdGVyX2Zhdm9yaXRlcy5jb2ZmZWUiLCJjbGllbnRfZmlsdGVycy5jb2ZmZWUiLCJjbGllbnRfcHJldmlldy5jb2ZmZWUiLCJjbGllbnRfc2VsZWN0X2ltYWdlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa0JBO0VBQUEsTUFBTSxDQUFDLGNBQVAsR0FBd0I7QUFBeEI7OztBQ2xCQTtBQUFBLE1BQUE7O0VBQU07OzswQkFFTCxNQUFBLEdBQVEsU0FBQTthQUNQLEVBQUEsQ0FBRyxjQUFILENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsUUFBM0I7SUFETzs7MEJBR1IsUUFBQSxHQUFVLFNBQUE7TUFDVCxJQUFDLENBQUEsR0FBRCxDQUFBO01BRUEsRUFBQSxDQUFHLFlBQUgsQ0FDQyxDQUFDLE1BREYsQ0FDUyxTQUFBO2VBQUksQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxjQUFiLENBQTRCLENBQUMsTUFBN0IsS0FBeUM7TUFBN0MsQ0FEVCxDQUVDLENBQUMsR0FGRixDQUVNLFNBRk4sRUFFaUIsTUFGakI7YUFJQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBUFM7OzBCQVNWLFVBQUEsR0FBWSxTQUFBO01BQ1gsSUFBQyxDQUFBLEdBQUQsQ0FBQTtNQUNBLEVBQUEsQ0FBRyxZQUFILENBQ0MsQ0FBQyxNQURGLENBQ1MsU0FBQTtlQUFJLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsY0FBYixDQUE0QixDQUFDLE1BQTdCLEtBQXVDO01BQTNDLENBRFQsQ0FFQyxDQUFDLEdBRkYsQ0FFTSxTQUZOLEVBRWlCLE1BRmpCO2FBSUEsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQU5XOzswQkFRWixHQUFBLEdBQUssU0FBQTtNQUNKLEVBQUEsQ0FBRyxZQUFILENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBckIsRUFBZ0MsRUFBaEM7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lB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QVA7TUFDQyxPQUFPLENBQUMsR0FBUixDQUFZLDBEQUFaO0FBQ0EsYUFGRDs7SUFJQSxXQUFBLEdBQW1CLENBQUksS0FBSyxDQUFDLEVBQU4sQ0FBUyxjQUFULENBQVQsR0FBeUMsQ0FBekMsR0FBZ0Q7SUFFOUQsS0FBSyxDQUFDLFFBQU4sQ0FBZSxZQUFmO0lBRUEsSUFBQSxHQUNDO01BQUEsTUFBQSxFQUFRLGdCQUFSO01BQ0EsYUFBQSxFQUFlLFFBRGY7TUFFQSxnQkFBQSxFQUFrQixXQUZsQjs7SUFJRCxPQUFBLEdBQ0M7TUFBQSxJQUFBLEVBQU0sTUFBTjtNQUNBLEdBQUEsRUFBSyxXQUFXLENBQUMsUUFEakI7TUFFQSxJQUFBLEVBQU0sSUFGTjtNQUdBLFFBQUEsRUFBVSxNQUhWO01BSUEsT0FBQSxFQUFTLFNBQUMsQ0FBRDtlQUNSLEtBQUssQ0FBQyxXQUFOLENBQWtCLFlBQWxCO01BRFEsQ0FKVDs7SUFPRCxJQUFBLEdBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxPQUFQO0lBQ1Asa0JBQUEsQ0FBbUIsS0FBbkIsRUFBMEIsV0FBMUI7V0FFQSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQUE7YUFDVCxpQkFBQSxDQUFrQixLQUFsQixFQUF5QixXQUF6QjtJQURTLENBQVY7RUE3QnVDLENBQXhDO0FBaEVBIiwiZmlsZSI6ImNsaWVudC1hcmVhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxud2luZG93LkNsaWVudF9HYWxsZXJ5ID0gQXBwIiwiY2xhc3MgVkNBX0ZpbHRlcnNcblxuXHRyZWxvYWQ6IC0+XG5cdFx0JCQoJy5qc19fbWFzb25yeScpLm1hc29ucnkoJ2xheW91dCcpXG5cblx0c2VsZWN0ZWQ6IC0+XG5cdFx0QGFsbCgpXG5cblx0XHQkJCgnLnZjYS1pbWFnZScpXG5cdFx0XHQuZmlsdGVyKC0+ICgkKHRoaXMpLmZpbmQoJy5pcy1zZWxlY3RlZCcpLmxlbmd0aCBpc250IDEpKVxuXHRcdFx0LmNzcygnZGlzcGxheScsICdub25lJylcblxuXHRcdEByZWxvYWQoKVxuXG5cdHVuc2VsZWN0ZWQ6IC0+XG5cdFx0QGFsbCgpXG5cdFx0JCQoJy52Y2EtaW1hZ2UnKVxuXHRcdFx0LmZpbHRlcigtPiAoJCh0aGlzKS5maW5kKCcuaXMtc2VsZWN0ZWQnKS5sZW5ndGggaXMgMSkpXG5cdFx0XHQuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxuXG5cdFx0QHJlbG9hZCgpXG5cblx0YWxsOiAtPlxuXHRcdCQkKCcudmNhLWltYWdlJykuY3NzKCdkaXNwbGF5JywgJycpXG5cdFx0QHJlbG9hZCgpXG5cbmZpbHRlcnMgPSBuZXcgVkNBX0ZpbHRlcnNcblxuJCQoJy5qc19fdmNhLWFjdGlvbicpLm9uICdjbGljaycsIC0+XG5cblx0IyBTZXR1cFxuXHQkdGhpcyA9ICQodGhpcylcblx0YWN0aW9uID0gJHRoaXMuZGF0YSgnYWN0aW9uJylcblxuXHQjIFdlIG5lZWQgYW4gYWN0aW9uXG5cdHJldHVybiBpZiBub3QgYWN0aW9uXG5cblx0JCQoJy5qc19fdmNhLWFjdGlvbicpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKVxuXHQkdGhpcy5hZGRDbGFzcygnaXMtYWN0aXZlJylcblxuXHRmaWx0ZXJzW2FjdGlvbl0oKVxuXG5cbiIsIiRpbnB1dCA9ICQoJyNqc19fZmlsdGVyLWlucHV0JylcblxuIyBXZSBtdXN0IGhhdmUgZmlsdGVycyB0byBkbyBvdXIgdGhpbmdcbnJldHVybiBpZiAkaW5wdXQubGVuZ3RoIGlzbnQgMVxuXG4kZmlsdGVyX3RhcmdldHMgPSAkKCcuanNfX2ZpbHRlcl9lbGVtZW50JylcblxucGFyc2VfbGlua3MgPSAtPlxuXHRpbmRleCA9IFtdXG5cblx0JGZpbHRlcl90YXJnZXRzLmVhY2ggKCBrZXksIGVsICkgLT5cblx0XHQkZWwgPSAkKGVsKVxuXHRcdCR0aXRsZSA9ICRlbC5maW5kKCcuanNfX2ZpbHRlcl9zcmMnKVxuXG5cdFx0dGl0bGUgPSAkdGl0bGUudGV4dCgpXG5cblx0XHRpbmRleC5wdXNoXG5cdFx0XHRpZDogJGVsLmF0dHIoJ2lkJylcblx0XHRcdHRpdGxlOiB0aXRsZVxuXHRcdFx0ZWw6ICRlbC5nZXQoMClcblxuXHRyZXR1cm4gaW5kZXhcblxuXG5cblxuREFUQSA9IHBhcnNlX2xpbmtzKClcblxuXG5cbmZpbmRfbWF0Y2hlcyA9ICggc291cmNlLCBrZXl3b3JkICkgLT5cblx0bWF0Y2hlcyA9IFtdXG5cblxuXHRmb3IgaXRlbSBpbiBzb3VyY2Vcblx0XHRpZiBrZXl3b3JkLnRlc3QoIGl0ZW0udGl0bGUgKVxuXHRcdFx0bWF0Y2hlcy5wdXNoIGl0ZW1cblxuXHRyZXR1cm4gbWF0Y2hlc1xuXG5cblxuIyBLZWVwIHRyYWNrIG9mIHZhbHVlIHRvIGF2b2lkIGR1cGxpY2F0aW9uXG5wcmV2aW91c192YWx1ZSA9IFwiXCJcblxuXG5cbmRvX2ZpbHRlciA9IChlKSAtPlxuXHR2YWwgPSAkaW5wdXQudmFsKClcblxuXHRyZXR1cm4gaWYgdmFsIGlzIHByZXZpb3VzX3ZhbHVlXG5cdHByZXZpb3VzX3ZhbHVlID0gdmFsXG5cblx0IyBXZSBuZWVkIHNvbWV0aGluZyB0byBzZWFyY2ggZm9yXG5cdGlmIHZhbC5sZW5ndGggPCAxXG5cdFx0JGZpbHRlcl90YXJnZXRzLmNzcyAnZGlzcGxheScsICcnXG5cdFx0JCQoJy5tYXNvbnJ5JykubWFzb25yeSgpXG5cdFx0cmV0dXJuXG5cblx0IyMjXG5cdFx0RmluZCBtYXRjaGVzXG5cdCMjI1xuXHRtYXRjaGVzID0gREFUQVxuXG5cdGZvciB2YWx1ZSBpbiB2YWwuc3BsaXQoXCIgXCIpXG5cdFx0bWF0Y2hlcyA9IGZpbmRfbWF0Y2hlcyggbWF0Y2hlcywgbmV3IFJlZ0V4cCh2YWx1ZSwgXCJpXCIpIClcblxuXHRpZiBtYXRjaGVzLmxlbmd0aCA+IDBcblx0XHQjIERvIHRoZSBmaWx0ZXJpbmcgdGhpbmdcblx0XHRleGNlcHQgPSBfLnBsdWNrKG1hdGNoZXMsICdlbCcpXG5cdFx0JGZpbHRlcl90YXJnZXRzXG5cdFx0XHQuY3NzICdkaXNwbGF5JywgJydcblx0XHRcdC5ub3QoIGV4Y2VwdCApXG5cdFx0XHQuY3NzICdkaXNwbGF5JywgJ25vbmUnXG5cblx0XHQkaW5wdXQucmVtb3ZlQ2xhc3MoJ25vdC1mb3VuZCcpXG5cdGVsc2Vcblx0XHQjIE5vdCBGb3VuZFxuXHRcdCRmaWx0ZXJfdGFyZ2V0cy5jc3MgJ2Rpc3BsYXknLCAnJ1xuXHRcdCRpbnB1dC5hZGRDbGFzcygnbm90LWZvdW5kJylcblxuXHQkJCgnLm1hc29ucnknKS5tYXNvbnJ5KClcblxuXG4kaW5wdXQub24gJ2tleXVwJywgXy50aHJvdHRsZSggZG9fZmlsdGVyLCA3NTAgKVxuJGlucHV0Lm9uICdibHVyJywgLT5cblx0JGlucHV0LnJlbW92ZUNsYXNzKCdub3QtZm91bmQnKVxuXG5cblxuIiwiXG5cblxucmV0dXJuIGlmICQkKCcjdmNhLXByZXZpZXcnKS5sZW5ndGggaXNudCAxXG5cblxuTEFTVF9JRCA9IC0xXG5Ib29rcy5hZGRBY3Rpb24gJ3RoZW1lLnJlc2l6ZWQnLCAtPlxuXHRMQVNUX0lEID0gLTFcblx0cmV0dXJuXG5cbmhpZGVfaW1hZ2VfcHJldmlldyA9IC0+XG5cdCQkKCcjdmNhLXByZXZpZXcnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpXG5cbnNob3dfaW1hZ2VfcHJldmlldyA9ICggaW1hZ2VfaWQsICRlbCApIC0+XG5cdCRpbWFnZV9jb250YWluZXIgPSAkJChcIiN2Y2EtaW1hZ2UtI3tpbWFnZV9pZH1cIilcblxuXHQjIFdlIG5lZWQgb25seSAxIGltYWdlLiBOb3QgMCwgbm90IDUuXG5cdHJldHVybiBpZiAkaW1hZ2VfY29udGFpbmVyLmxlbmd0aCBpc250IDFcblxuXHQjIElmIHRoZSBpbWFnZSBpcyBhbHJlYWR5IHRoZXJlLCBkb24ndCByZS1kbyBhbGwgdGhlIERPTSBtb2RpZmljYXRpb25cblx0aWYgTEFTVF9JRCBpcyBpbWFnZV9pZFxuXHRcdCQkKCcjdmNhLXByZXZpZXcnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKVxuXHRcdHJldHVyblxuXG5cblx0JGltYWdlID0gJGltYWdlX2NvbnRhaW5lci5maW5kKCdpbWcnKVxuXHQkJCgnI3ZjYS1wcmV2aWV3LWNvbnRlbnQnKS5odG1sKCRpbWFnZS5jbG9uZSgpKVxuXG5cdGVsX3Bvc2l0aW9uID0gJGVsLm9mZnNldCgpXG5cdGVsX2hlaWdodCA9ICRlbC5vdXRlckhlaWdodCgpXG5cblx0JCQoJyN2Y2EtcHJldmlldycpLmNzc1xuXHRcdHRvcDogZWxfcG9zaXRpb24udG9wICsgZWxfaGVpZ2h0ICsgMlxuXHRcdGxlZnQ6IGVsX3Bvc2l0aW9uLmxlZnRcblx0XHRkaXNwbGF5OiAnYmxvY2snXG5cblx0TEFTVF9JRCA9IGltYWdlX2lkXG5cdHJldHVyblxuXG5cbiMjI1xuICAgQXR0YWNoIEV2ZW50cyB0byBtb3VzZWVudGVyIGFuZCBtb3VzZWxlYXZlXG4jIyNcblxuJCQoJy52Y2EtcHJldmlldy1saW5rJykub24gXCJtb3VzZWVudGVyXCIsIC0+XG5cdCR0aGlzID0gJCh0aGlzKVxuXHRpbWFnZV9oYXNoID0gJHRoaXMudGV4dCgpXG5cblx0IyBVc2UgUmVnZXggdG8gZ2V0IG9ubHkgbnVtYmVycyBmcm9tIGltYWdlX2hhc2hcblx0aW1hZ2VfaWQgPSBpbWFnZV9oYXNoLnJlcGxhY2UgL1teMC05XS9nLCAnJ1xuXG5cdHNob3dfaW1hZ2VfcHJldmlldyggaW1hZ2VfaWQsICR0aGlzIClcblxuJCQoJy52Y2EtcHJldmlldy1saW5rJykub24gXCJtb3VzZWxlYXZlXCIsIGhpZGVfaW1hZ2VfcHJldmlldyIsIlxuIyBUaGVyZSBtdXN0IGJlIGFuIEFKQVggVVJMXG5yZXR1cm4gaWYgbm90IHdpbmRvdy5hamF4X29iamVjdD8gb3Igbm90IHdpbmRvdy5hamF4X29iamVjdC5hamF4X3VybD9cblxuaW1hZ2Vfc3RhdGVfY2hhbmdlID0gKCAkdGhpcywgaXNfc2VsZWN0ZWQgKSAtPlxuXHRpZiBpc19zZWxlY3RlZCBpcyAwXG5cdFx0IyBEZXNlbGVjdFxuXHRcdCR0aGlzLnJlbW92ZUNsYXNzKCdpcy1zZWxlY3RlZCcpXG5cdGVsc2Vcblx0XHQjIFNlbGVjdFxuXHRcdCR0aGlzLmFkZENsYXNzKCdpcy1zZWxlY3RlZCcpXG5cbmltYWdlX3N0YXRlX2Vycm9yID0gKCAkdGhpcywgaXNfc2VsZWN0ZWQgKSAtPlxuXG5cdCMgUmV2ZXJ0IGlzX3NlbGVjdGVkIHZhbHVlXG5cdGlzX3NlbGVjdGVkID0gaWYgKCBpc19zZWxlY3RlZCBpcyAwICkgdGhlbiAxIGVsc2UgMFxuXG5cdCMgUmV2ZXJ0IHN0YXRlXG5cdGltYWdlX3N0YXRlX2NoYW5nZSggJHRoaXMsIGlzX3NlbGVjdGVkIClcblxuXHQjIFRyaWdnZXIgRXJyb3Jcblx0ZGlzcGxheV9lcnJvcl9tZXNzYWdlKCAkdGhpcyApXG5cblxuZGlzcGxheV9lcnJvcl9tZXNzYWdlID0gKCAkZWwgKSAtPlxuXHQjIFRyeSBnZXR0aW5nIGFuIGltYWdlIElEXG5cdGltYWdlX2lkID0gJGVsLmRhdGEoJ2ltYWdlSWQnKVxuXG5cdCMgV2UgbmVlZCBzb21lIGZvcm0gb2YgSUQ6XG5cdGlmIG5vdCBpbWFnZV9pZFxuXHRcdGltYWdlX2lkID0gMFxuXG5cdCRlcnJvciA9ICQkKCcudmNhLWVycm9yX19tZXNzYWdlLmpzX190ZW1wbGF0ZScpXG5cdFx0LmNsb25lKClcblx0XHQucmVtb3ZlQ2xhc3MoJ2pzX190ZW1wbGF0ZScpXG5cblx0dGV4dCA9ICRlcnJvci50ZXh0KClcblx0dGV4dCA9IHRleHQucmVwbGFjZSgnIyNpbWFnZV9pZCMjJywgXCIjI3tpbWFnZV9pZH1cIilcblx0JGVycm9yLnRleHQoIHRleHQgKVxuXG5cblx0JGVycm9yXG5cdFx0LmNzcygnb3BhY2l0eScsIDApXG5cdFx0LmFwcGVuZFRvKCAkJCgnLnZjYS1lcnJvcl9fY29udGFpbmVyJykgKVxuXHRcdC52ZWxvY2l0eVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0dHJhbnNsYXRlWTogWzAsIDEwXVxuXHRcdFx0XHRvcGFjaXR5OiBbMSwgMF1cblx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdGR1cmF0aW9uOiA2MDBcblxuXHQkZXJyb3IudmVsb2NpdHlcblx0XHRwcm9wZXJ0aWVzOiAnZmFkZU91dCdcblx0XHRvcHRpb25zOlxuXHRcdFx0ZHVyYXRpb246IDIwMDBcblx0XHRcdGRlbGF5OiAzMDAwXG5cdFx0XHRlYXNpbmc6ICdlYXNlSW5PdXRRdWFkJ1xuXHRcdFx0Y29tcGxldGU6IC0+XG5cdFx0XHRcdCRlcnJvci5yZW1vdmUoKVxuXHRcdFx0XHQkZXJyb3IgPSBudWxsXG5cdFx0XHRcdHJldHVyblxuXG5cbiMjI1xuICAgIEF0dGFjaCBFdmVudHMgdG8gLmltYWdlLW1ldGFcbiMjI1xuJCgnLnZjYS1pbWFnZSAuaW1hZ2UtbWV0YScpLm9uICdjbGljaycsIC0+XG5cblx0JHRoaXMgPSAkKHRoaXMpXG5cdGltYWdlX2lkID0gJHRoaXMuZGF0YSgnaW1hZ2VJZCcpXG5cblx0aWYgbm90IGltYWdlX2lkXG5cdFx0Y29uc29sZS5sb2cgXCJBSkFYIEVycm9yOiBDYW4ndCBzZWxlY3QvdW5zZWxlY3QgYW4gaW1hZ2Ugd2l0aG91dCBhbiBJRFwiXG5cdFx0cmV0dXJuXG5cblx0aXNfc2VsZWN0ZWQgPSBpZiAoIG5vdCAkdGhpcy5pcygnLmlzLXNlbGVjdGVkJykgKSB0aGVuIDEgZWxzZSAwXG5cblx0JHRoaXMuYWRkQ2xhc3MoJ2lzLWxvYWRpbmcnKVxuXG5cdGRhdGEgPVxuXHRcdGFjdGlvbjogJ3ZjYV9zYXZlX3N0YXRlJ1xuXHRcdGF0dGFjaG1lbnRfaWQ6IGltYWdlX2lkXG5cdFx0YXR0YWNobWVudF9zdGF0ZTogaXNfc2VsZWN0ZWRcblxuXHRyZXF1ZXN0ID1cblx0XHR0eXBlOiAnUE9TVCdcblx0XHR1cmw6IGFqYXhfb2JqZWN0LmFqYXhfdXJsXG5cdFx0ZGF0YTogZGF0YVxuXHRcdGRhdGFUeXBlOiAnanNvbidcblx0XHRzdWNjZXNzOiAocikgLT5cblx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKCdpcy1sb2FkaW5nJylcblxuXHQkZGZkID0gJC5hamF4KHJlcXVlc3QpXG5cdGltYWdlX3N0YXRlX2NoYW5nZSgkdGhpcywgaXNfc2VsZWN0ZWQpXG5cblx0JGRmZC5mYWlsIC0+XG5cdFx0aW1hZ2Vfc3RhdGVfZXJyb3IoJHRoaXMsIGlzX3NlbGVjdGVkKSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==