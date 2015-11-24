/**
 * Created by anna on 23.11.15.
 */
define([
    'backbone'
], function(
    Backbone
) {


    var methodMap = {
        'read': 'GET'
    };

    var urlMap = {
        config: '/config/'
    };

    return function(method, model, options) {
        var params = {type: methodMap[method]};
        params.dataType = 'json';
        params.contentType = 'application/json';

        params.url = urlMap['config'];
        params.success = function (data) {
            model.setProperties(data);
        };

        params.error = function (data) {
            model.error();
        };

        return Backbone.ajax(params);

    }

});