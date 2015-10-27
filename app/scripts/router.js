/*global jQuery, Backbone */

var Shareabouts = Shareabouts || {};

(function(NS, $, console){
  'use strict';

  NS.Router = Backbone.Marionette.AppRouter.extend({
    controller: NS.controller,
    appRoutes: {
      '': 'datasetList',
      ':dataset_slug': 'placeList',
      ':dataset_slug/page/:page': 'placeList',
      ':dataset_slug/filter/:filter': 'filteredPlaceList',
      ':dataset_slug/filter/:filter/page/:page': 'filteredPlaceList',
      ':dataset_slug/:place_id': 'placeForm'
    }
  });
}(Shareabouts, jQuery, Shareabouts.Util.console));