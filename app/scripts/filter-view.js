/*global jQuery, Backbone, _ */

var Shareabouts = Shareabouts || {};

(function(NS, $, console){
  'use strict';

  NS.FilterView = Backbone.Marionette.ItemView.extend({
    template: NS.Templates.filter,
    ui: {
      filterText: '.filter-value',
      filterSpinner: '.filter-spinner'
    },
    events: {
      'input @ui.filterText': 'handleFilterTextInput'
    },
    applyCollectionFilter: _.debounce(function() {
      var self = this;

      self.filterChanged = false;
      self.collection.fetch({
        reset: true,
        data: {
          include_private: true,
          include_invisible: true,
          page_size: 25
        },
        complete: function() {
          if (!self.filterChanged) {
            self.ui.filterSpinner.addClass('hide');
          }
        }
      });

      NS.router.navigate(this.collection.getPath());
    }, 500),
    handleFilterTextInput: function(evt) {
      evt.preventDefault();
      var $target = $(evt.currentTarget),
          filter = $target.val();

      this.collection.setFilter(filter || null);

      this.filterChanged = true;
      this.applyCollectionFilter();
      this.ui.filterSpinner.removeClass('hide');
    },
    serializeData: function(){
      var data = {};

      if (this.model) {
        data = this.model.toJSON();
      }
      else if (this.collection) {
        data = {
          items: this.collection.toJSON(),
          metadata: this.collection.metadata,
          filter: this.collection.filter
        };
      }

      return data;
    }
  });

}(Shareabouts, jQuery, Shareabouts.Util.console));