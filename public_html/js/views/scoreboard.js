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
            $('#page').append(this.el);
            this.collection = new collection();
            this.collection.comparator = function(atribute) {
                return -atribute.get("score");
            };
            this.collection.set(
                [
                    {name: "Ann", score:78809},
                    {name: "Sanya", score:78809},
                    {name:"Oleg", score:1000},
                    {name:"Artem", score:1200},
                    {name:"Ivan", score:1000},
                    {name:"Ilya", score:48680},
                    {name:"Ira", score:200},
                    {name:"Katya", score:2345},
                    {name:"Setgey", score:670},
                    {name:"Belodedov", score:9999999},
                    {name:"Aa", score:1},
                    {name:"Mr.Cat", score:1234567}
                ]);
            this.render();
        },
        render: function () {
            this.collection.sort();
            this.collection.models = this.collection.first(10);
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