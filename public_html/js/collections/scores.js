/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'models/scores'
], function(
    Backbone,
    Score
){

    var Collection = Backbone.Collection.extend({
        model: Score													//связываем коллекцию с модель
    });

    //return new Collection();
    return Collection;
});