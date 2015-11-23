/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone'
], function(
    Backbone
){

    var Model = Backbone.Model.extend({

        defaults: {
            name:'',
            score:0
        }
    });

    return Model;
});