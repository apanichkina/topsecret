/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'api/scoreSync'
], function(
    Backbone,
    scoreSync
){

    return Backbone.Model.extend({
        url: "/",

        defaults: {
            name:'',
            score:0
        },

    scoreboardSuccess: function (data) {
        this.clear();
        this.set({
            'name': data.response.name,
            'score': data.response.score
        });
        this.trigger(this.loginCompleteEvent);
    },

    scoreboardFailed: function (data) {
        this.clear();
        this.set('error', data.response.description);
        this.trigger(this.loginFailedEvent);
    }
    });
});