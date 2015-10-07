/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'jquery',
    'rouer'
], function(Backbone, jQuery, router) {

    var views = [];

    var Manager = Backbone.View.extend({

        addView: function(currentView) {
            views.push(currentView);
            this.listenTo(currentView, "show", function() {
                views.forEach( function(view) {
                    if (view != currentView)
                        view.hide();
                });
            });
        }

    });

    return new Manager();
});