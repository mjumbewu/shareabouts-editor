/*global jQuery, Backbone */

var Shareabouts = Shareabouts || {};

(function(NS, $, console){
  'use strict';

  NS.PlaceListItemView = Backbone.Marionette.ItemView.extend({
    className: 'panel radius',
    template: NS.Templates['place-list-item']
  });

  NS.PlaceListView = Backbone.Marionette.CollectionView.extend({
    childView: NS.PlaceListItemView,
    childViewContainer: '.place-items'
  });

  NS.PlaceListLayout = Backbone.Marionette.LayoutView.extend({
    template: NS.Templates['place-list'],
    regions: {
      paginationRegion: '.pagination-region',
      placeListRegion: '.place-list-region'
    },
    collectionEvents: {
      'reset': 'renderPagination'
    },
    renderPagination: function(){
      if (this.collection.metadata.num_pages > 1) {
        this.paginationRegion.show(new NS.PaginationView({
          collection: this.collection
        }));
      } else {
        this.paginationRegion.destroy();
      }
    },
    onRender: function() {
      this.placeListRegion.show(new NS.PlaceListView({
        collection: this.collection
      }));
    }
  });

}(Shareabouts, jQuery, Shareabouts.Util.console));