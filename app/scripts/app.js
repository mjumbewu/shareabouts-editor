/*global jQuery, Backbone */

var Shareabouts = Shareabouts || {};

(function(NS, $, console){
  'use strict';

  NS.app = new Backbone.Marionette.Application();

  // Add the main region
  NS.app.addRegions({
    headerRegion: '#header-region',
    mainRegion: '#main-region'
  });

  // Initialize the dataset collection
  NS.app.addInitializer(function(options){
    NS.datasetCollection = new Backbone.Collection([
      { id: 'abandoned-bikes', name: 'Abandoned Bikes', url: 'http://data.shareabouts.org/api/v2/chicagobikes/datasets/chicago-abandoned-bikes', dataUrl: 'http://data.shareabouts.org/api/v2/chicagobikes/datasets/chicago-abandoned-bikes/places?include_invisible&include_private&page_size=5000&format=csv'
},
      { id: 'bike-parking', name: 'Bike Parking', url: 'http://data.shareabouts.org/api/v2/chicagobikes/datasets/chicago-bike-parking', dataUrl: 'http://data.shareabouts.org/api/v2/chicagobikes/datasets/chicago-bike-parking/places?include_invisible&include_private&page_size=5000&format=csv'}
    ]);
  });

  // Initialize the place collection
  NS.app.addInitializer(function(options){
    NS.placeCollection = new NS.PlaceCollection();
    // NS.placeCollection.url = 'http://data.shareabouts.org/api/v2/demo-user/datasets/demo-data/places';

    // Add functions for un/setting a filter.
    NS.placeCollection.setFilter = function(filter) { this.filter = filter; };
    NS.placeCollection.unsetFilter = function() { this.setFilter(null); };

    // Update the fetch method to respect the current filter.
    var placeCollectionFetch = NS.placeCollection.fetch;
    NS.placeCollection.fetch = function(options) {
      options = options || {};

      if (this.filter) {
        options.data = options.data || {};
        options.data['search'] = this.filter;
      }

      return placeCollectionFetch.call(this, options);
    };

    NS.placeCollection.getPath = function(page) {
      var path = NS.currentDataset.get('id');
      if (NS.placeCollection.filter) {
        path += '/filter/' + NS.placeCollection.filter;
      }
      if (page && page > 1) {
        path += '/page/' + page;
      }
      return path;
    };
  });

  // Initialize the user authentication
  NS.app.addInitializer(function(options){
    NS.auth = new NS.Auth();
  });

  // Show the header region
  NS.app.addInitializer(function(options){
    var view = new NS.HeaderBarView();
    NS.app.headerRegion.show(view);
  });

  // Initialize the router and history on start
  NS.app.addInitializer(function(options){
    NS.router = new NS.Router();
    Backbone.history.start();

    // Scroll to the top of the page on route changes
    NS.router.on('route', function() {
      window.scrollTo(0,0);
    });
  });
}(Shareabouts, jQuery, Shareabouts.Util.console));