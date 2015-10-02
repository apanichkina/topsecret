/**
 * Created by Alex on 21.09.15.
 */

define([
    'backbone',
    'tmpl/scoreboard',
    'models/scores',
    'collections/scores'
], function(
    Backbone,
    tmpl,
    Score,
    collection
){

    var View = Backbone.View.extend({

        template: tmpl,
        initialize: function () {
            $('body').append(this.el);
            this.collection = new collection();
            this.collection.comparator = function(atribute) {
                return atribute.get("score");
            };
            this.collection.set(
                [
                    {name: "Ann", score: 78809},
                    {name: "Annjhhj", score: 78809},
                    {name:"Aa", score:1000}
                ]);
            this.collection.sort();
            this.render();
        },
        render: function () {
            this.$el.html(this.template(this.collection.toJSON()));
        },
        show: function () {
            this.$el.show();
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});