/**
 * Created by anna on 01.11.15.
 */


define([
    'backbone',
    'models/player'
], function(
    Backbone,
    Player
){
    var Collection = Backbone.Collection.extend({
        model: Player,
        changed: 'playersChanged'
    });
    return new Collection();
});