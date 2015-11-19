define([
    'backbone',
    'tmpl/lobby',
    'models/user',
    'collections/lobbies'
], function (
    Backbone,
    tmpl,
    userModel,
    lobbyCollection
) {

    var View = Backbone.View.extend({

        template: tmpl,
        user: userModel,
        lobbies: lobbyCollection,


        initialize: function () {
            $('#page').append(this.el);
            this.listenTo(lobbyCollection, this.lobbies.changed, this.render);
        },

        render: function () {
            this.$el.html(this.template(this.lobbies.fetchAll()));
        },

        show: function(){
            this.$el.show();
            this.trigger("show", this);
        },

        hide: function(){
            this.$el.hide();
        }

    });

    return new View();

});
