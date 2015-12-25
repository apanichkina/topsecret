/**
 * Created by Alex on 25.12.15.
 */
define([
    'backbone'
], function(
    Backbone
) {

    var Model = Backbone.Model.extend({

        setCode: function(code){
            this.set({'code': code});
        },

        getCode: function() {
            return this.get('code');
        },

        getUrl: function(){
            return "http://"+window.location.host+"/mobile/?pass=" + this.getCode();
        }

    });

    return Model;

});