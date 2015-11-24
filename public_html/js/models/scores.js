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

    var Model = Backbone.Model.extend({
        url: "/",

        defaults: {
            name:'',
            score:0
        }

    });

    return Model;
});