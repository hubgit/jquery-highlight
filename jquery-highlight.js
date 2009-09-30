(function($, highlight) {
  $[highlight] = {
    defaults: {
      highlightClass: 'highlight',
      searchEvent:    $.browser.safari ? 'search' : 'keyup',
      onShow:         function(elem) { elem.show(); },
      onHide:         function(elem) { elem.hide(); },
      highlightHTML:  function(html, query, highlightClass) {
        var re     = new RegExp('('+query+')', "gi"),
            subs   = '<span class="' + highlightClass + '">$1</span>',
            last   = 0,
            tag    = '<',
            skip   = false,
            skipre = new RegExp('^(script|style|textarea)', 'gi'),
            part   = null,
            result = '';

        while (last >= 0) {
          var pos = html.indexOf(tag, last);
          if (pos < 0) {
            part = html.substring(last);
            last = -1;
          } else {
            part = html.substring(last, pos);
            last = pos + 1;
          }

          if (tag == '<') {
            if (!skip) {
              part = part.replace(re, subs);
            } else {
              skip = false;
            }
          } else if (part.match(skipre)) {
            skip = true;
          }

          result += part + (pos < 0 ? '' : tag);
          tag = (tag == '<') ? '>' : '<';
        }

        return result;
      }
    }
  };
  
  /**
   * Highlight a DOM element with a list of keywords.
   */
  $.fn[highlight] = function(to_watch, options) {
    if (!this.length || !$(to_watch).length) {
      return this;
    }
  
    // Setup index
    var index = {};
    this.each(function() {
      var elem    = $(this),
          content = $.trim(elem.html().toLowerCase());
      elem.data('restore', elem.html());
      index[content] = elem;
    });
    
    options = $.extend({}, $[highlight].defaults, options);
    
    $(to_watch).bind(options.searchEvent, function() {
      var search       = $(this).val().toLowerCase(),
          search_parts = search.split(' ');

      $.each(index, function(key, elem) {
        elem.html(elem.data('restore'));

        if (search.length < 1) {
          return options.doShow(elem);
        }
        
        var found = false;
        $.each(search_parts, function() {
          if (key.indexOf(this) < 1) {
            return;
          }
          
          elem.html(options.highlightHTML(elem.html(), this, options.highlightClass));
          options.doShow(elem);
          found = true;
        });
          
        if (!found) {
          options.doHide(elem);
        }
      });
    });

    return this;
  };
})(jQuery, "highlight");