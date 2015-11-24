define([
    'backbone'
], function(
    Backbone
) {

    var Model = Backbone.Model.extend({

        defaults: {
            name: 'Default Lobby',
            maxCount: 6,
            isStarted: false,
            count: 0
        }
    });

    return Model;

});