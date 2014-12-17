/*global jQuery, Backbone, _, L */

var Shareabouts = Shareabouts || {};

(function(NS, $, console){
  'use strict';

  var signInRequired = function(f) {
    var wrapper = function() {
      var wrapperArgs = arguments,
          successRedirect = function() { f.apply(this, wrapperArgs); },
          user;

      // Check whether the user is logged in
      user = NS.auth.getUserSession();

      if (!user) {
        // If not, run the sign in with the success redirect
        NS.controller.signin(successRedirect);
      } else {
        // If so then just run the wrapped function
        NS.user = user;
        f.apply(this, wrapperArgs);
      }
    };

    return wrapper;
  };

  NS.controller = {
    index: function() {
      console.log('show the index');
    },
    signin: function(redirect) {
      var view = new NS.SignInView({
        redirect: redirect
      });
      NS.app.mainRegion.show(view);
    },
    datasetList: signInRequired(function() {
      var view = new NS.DatasetListView({
        collection: NS.datasetCollection
      });

      NS.app.mainRegion.show(view);
    }),
    placeList: signInRequired(function(datasetSlug, page, options) {
      options = options || {};
      NS.placeCollection.setFilter(options.filter);

      // Set the dataset url on the place collection
      NS.currentDataset = NS.datasetCollection.findWhere({ id: datasetSlug });
      NS.placeCollection.url = NS.currentDataset.get('url') + '/places';

      var view = new NS.PlaceListLayout({
        model: NS.currentDataset,
        collection: NS.placeCollection
      });

      NS.app.mainRegion.show(view);

      NS.placeCollection.fetch({
        reset: true,
        data: {
          include_private: true,
          include_invisible: true,
          page_size: 25,
          page: parseInt(page, 10) || 1
        }
      });
    }),
    filteredPlaceList: function(datasetSlug, filter, page) {
      return this.placeList(datasetSlug, page, {filter: filter});
    },
    placeForm: signInRequired(function(datasetSlug, placeId) {
      // Set the dataset url on the place collection
      NS.currentDataset = NS.datasetCollection.findWhere({ id: datasetSlug });
      NS.placeCollection.url = NS.currentDataset.get('url') + '/places';

      var model = NS.placeCollection.get(placeId),
          getWard = function(lat, lng, success, error) {
            $.ajax({
              url: 'https://shareabouts-region-service.herokuapp.com/api/v1/chicago/wards_communityareas',
              data: {
                ll: lat+','+lng
              },
              dataType: 'jsonp',
              success: success,
              error: error
            });
          },
          showPlaceForm = function(model) {
            var $alert = $('.save-message'),
                template = model.get('location_type') === 'bikeparking' ?
                              'bike-parking-form' : 'abandoned-bike-form',
                view = new NS.PlaceFormView({
                  model: model,
                  collection: NS.placeCollection,
                  template: NS.Templates[template],
                  silent: true,
                  include_invisible: true,
                  success: function() {
                    $alert.removeClass('alert').addClass('success show');
                    _.delay(function() {
                      $alert.removeClass('show');
                    }, 3000);

                    view.render();
                    NS.app.mainRegion.show(view);
                  },
                  error: function() {
                    $alert.removeClass('success').addClass('alert show');
                    _.delay(function() {
                      $alert.removeClass('show');
                    }, 3000);
                  }
                });

                view.on('render', function() {
                  this.$('.location-details').html(
                    NS.Templates['location-details'](this.model.toJSON())
                  );
                });

                view.on('show', function() {
                  // Setup a map for editing the place
                  var coords = model.get('geometry').coordinates,
                      map = L.map(view.$('.map').get(0), {
                        layers: [L.tileLayer('http://{s}.tiles.mapbox.com/v3/openplans.map-dmar86ym/{z}/{x}/{y}.png', {
                          attribution: '&copy; OpenStreetMap contributors, CC-BY-SA. <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>',
                        })],
                        center: [coords[1], coords[0]],
                        zoom: 15
                      }),
                      marker = L.marker([coords[1], coords[0]], {
                        draggable: true
                      }).addTo(map);

                  // Set the lat/lng of the location
                  marker.on('dragend', function(evt) {
                    var ll = marker.getLatLng();
                    view.setGeometry({
                      type: 'Point',
                      coordinates: [ll.lng, ll.lat]
                    });

                    NS.Util.MapQuest.reverseGeocode(ll, {
                      success: function(data) {
                        var locationsData = data.results[0].locations;
                        if (locationsData.length > 0) {
                          model.set('location', locationsData[0]);
                          view.$('.location-details').html(
                            NS.Templates['location-details'](view.model.toJSON())
                          );
                        }
                      }},
                      'Fmjtd%7Cluur2g0bnl%2C25%3Do5-9at29u'
                    );

                    getWard(ll.lat, ll.lng,
                        function(data) {
                          model.set(data);
                          view.$('.location-details').html(
                            NS.Templates['location-details'](view.model.toJSON())
                          );
                        },
                        function() {
                          window.alert('Oops, we couldn\'t update the ward. Move the marker to try again.');
                        });
                  });
                });

            NS.app.mainRegion.show(view);
          };

      if (model) {
        showPlaceForm(model);
      } else {
        NS.placeCollection.fetchById(placeId, {
          data: {
            include_private: true,
            include_invisible: true
          },
          success: showPlaceForm,
          error: function() {
            window.alert('Place ' + placeId + ' can not be found.');
            NS.router.navigate('', {trigger: true});
          }
        });
      }
    })
  };


}(Shareabouts, jQuery, Shareabouts.Util.console));