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
        }

    });
});