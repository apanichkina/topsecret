/**
 * Created by anna on 01.11.15.
 */
define([
    'backbone'
], function(
    Backbone
){

    var Model = Backbone.Model.extend({
        defaults: {
            x: 100,
            y: 100,
            radius: 5,
            Vx: 0,
            Vy: 0,
            type: "human",
            isNotStop: function() {
                return this.Vx + this.Vy;
            }
        },
        initialize: function () {
        }
        //idAttribute: id
        //constructor: function(id,currX,currY) {
        //    this.id = id;
        //    this.x = currX;
        //    this.y = currY;
        //}
    });

    return Model;
});