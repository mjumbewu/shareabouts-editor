/*global jQuery, Backbone */

var Shareabouts = Shareabouts || {};

(function(NS, $, console){
  'use strict';

  NS.DatasetListItemView = Backbone.Marionette.ItemView.extend({
    className: 'panel radius',
    template: NS.Templates['dataset-list-item']
  });

  NS.DatasetListView = Backbone.Marionette.CompositeView.extend({
    template: NS.Templates['dataset-list'],
    childView: NS.DatasetListItemView,
    childViewContainer: '.dataset-items'
  });


}(Shareabouts, jQuery, Shareabouts.Util.console));