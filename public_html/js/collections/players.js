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
    //return new Collection([{x:300, y:300, radius: 10, type:"ball"}],false);
    return new Collection();
});