/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'models/scores',
    'api/scoreSync'
], function(
    Backbone,
    Score,
    scoreSync
){

    var Collection = Backbone.Collection.extend({

        sync: scoreSync,
        model: Score,

        changed: 'changedEvent',

        setScores: function(data) {
            this.set(data.users);
            this.trigger(this.changed);
        },

        comparator: function(atribute) {
            return -atribute.get("score");
        },
        firstN: function(n){
            return this.first(n).map(function(model) {
                return model.toJSON();
            })
        }
    });

    return new Collection();
});