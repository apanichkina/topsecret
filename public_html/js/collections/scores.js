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
        //TODO контроллер для работы с LS
        //TODO сильно криво я сделала?
        storage: window.localStorage,
        setScores: function(data) {
            this.set(data.models[0].get('users'));//кладем в коллекцию
            this.storage.clear();
            var ScoreInfo;
            var length = data.length;
            for (var i = 0; i < length; ++i){
                ScoreInfo = {score: data.models[i].get('score'), lose:data.models[i].get('lose'), draw: data.models[i].get('draw') };
                this.storage.setItem(data.models[i].get('name'), JSON.stringify(ScoreInfo));
            }
            this.trigger(this.changed);
        },

        setFromLocalStorage: function(){
            var name;
            var score;
            this.reset();
            var length = this.storage.length;
            for (var i = 0; i < length; ++i){
                name = this.storage.key(i);
                score = this.storage.getItem(name);
                var score = JSON.parse(score);
                this.add({name: name, score: score.score, lose: score.lose, draw: score.draw});
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

    return Collection;
});