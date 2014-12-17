/*global jQuery, Backbone */

var Shareabouts = Shareabouts || {};

(function(NS, $, console){
  'use strict';

  NS.PlaceListItemView = Backbone.Marionette.ItemView.extend({
    className: 'panel radius',
    template: NS.Templates['place-list-item']
  });

  NS.PlaceListView = Backbone.Marionette.CollectionView.extend({
    itemView: NS.PlaceListItemView,
    itemViewContainer: '.place-items'
  });

  NS.PlaceListLayout = Backbone.Marionette.Layout.extend({
    template: NS.Templates['place-list'],
    regions: {
      filterRegion: '.filter-region',
      upperPaginationRegion: '.pagination-region:first',
      lowerPaginationRegion: '.pagination-region:last',
      placeListRegion: '.place-list-region'
    },
    collectionEvents: {
      'reset': 'renderPagination'
    },
    renderPagination: function(){
      if (this.collection.metadata.num_pages > 1) {
        this.upperPaginationRegion.show(new NS.PaginationView({
          collection: this.collection
        }));
        this.lowerPaginationRegion.show(new NS.PaginationView({
          collection: this.collection
        }));
      } else {
        this.upperPaginationRegion.close();
        this.lowerPaginationRegion.close();
      }
    },
    onRender: function() {
      this.filterRegion.show(new NS.FilterView({
        collection: this.collection
      }));
      this.placeListRegion.show(new NS.PlaceListView({
        collection: this.collection
      }));
    }
  });

}(Shareabouts, jQuery, Shareabouts.Util.console));