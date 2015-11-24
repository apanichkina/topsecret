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
        storage: window.localStorage,
        setScores: function(data) {
            this.set(data.users);
            for (var i=0; i<data.users.length; ++i){
                this.storage.setItem(data.users[i].name, data.users[i].score) ;
            }
            this.trigger(this.changed);
        },

        setFromLocalStorage: function(){
            var name;
            var score;
            this.reset();
            for (var i=0; i < this.storage.length; ++i){
                name = this.storage.key(i);
                score = this.storage.getItem(name);
                this.add({name: name, score: score});
            }
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