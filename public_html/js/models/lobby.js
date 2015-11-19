define([
    'backbone'
], function(
    Backbone
) {

    return Backbone.Model.extend({

        defaults: {
            name: 'Default Lobby',
            maxCount: 6,
            isStarted: false,
            count: 0
        }
    });

});