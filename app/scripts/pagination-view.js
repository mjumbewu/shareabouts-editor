/*global jQuery, Backbone */

var Shareabouts = Shareabouts || {};

(function(NS, $, console){
  'use strict';

  NS.PaginationView = Backbone.Marionette.ItemView.extend({
    template: NS.Templates.pagination,
    ui: {
      pageLink: 'a'
    },
    events: {
      'click @ui.pageLink': 'handlePageLinkClick'
    },
    handlePageLinkClick: function(evt) {
      evt.preventDefault();
      var $target = $(evt.currentTarget),
          page = parseInt($target.attr('data-page'), 10);

      if (page && page !== this.collection.metadata.page) {
        this.collection.fetch({
          reset: true,
          data: {
            include_private: true,
            include_invisible: true,
            page_size: 25,
            page: parseInt(page, 10) || 1
          }
        });

        NS.router.navigate(this.collection.getPath(page));
      }

    },
    serializeData: function(){
      var data = {};

      if (this.model) {
        data = this.model.toJSON();
      }
      else if (this.collection) {
        data = {
          items: this.collection.toJSON(),
          metadata: this.collection.metadata
        };
      }

      return data;
    }
  });

}(Shareabouts, jQuery, Shareabouts.Util.console));