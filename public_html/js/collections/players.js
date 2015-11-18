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
        model: Player
    });
    //return new Collection([{x:300, y:300, radius: 10, type:"ball"}],false);
    return Collection;
});