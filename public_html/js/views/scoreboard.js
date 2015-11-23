/**
 * Created by Ann on 21.09.15.
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
    scoreCollection
){

    var View = Backbone.View.extend({

        template: tmpl,
        collection: scoreCollection,

        initialize: function () {
            $('#page').append(this.el);

            this.listenTo(this.collection, this.collection.changed, this.render);

            if (!this.supportsStorage()) alert("You don't have localstorage");
            else{
                
            }

            //this.collection.set(
            //    [
            //        {name: "Ann", score:78809},
            //        {name: "Sanya", score:78809},
            //        {name:"Oleg", score:1000},
            //        {name:"Artem", score:1200},
            //        {name:"Ivan", score:1000},
            //        {name:"Ilya", score:48680},
            //        {name:"Ira", score:200},
            //        {name:"Katya", score:2345},
            //        {name:"Setgey", score:670},
            //        {name:"Belodedov", score:9999999},
            //        {name:"Aa", score:1},
            //        {name:"Mr.Cat", score:1234567}
            //    ]);
            this.render();
        },
        render: function () {
            this.$el.html(this.template(this.collection.firstN(10)));
        },
        show: function () {
            this.collection.fetch();
            this.$el.show();
            this.trigger("show", this);
        },
        hide: function () {
            this.$el.hide();
        },

        supportsStorage: function() {
           try{
               return 'localStorage' in window && window['localStorage'] !== null;
           } catch(e) {
               return false;
           }
        }

    });

    return new View();
});