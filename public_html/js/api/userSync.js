define([
    'backbone'
], function(
    Backbone
) {

    var methodMap = {
        'create': 'POST',
        'read': 'POST',
        'delete': 'POST'
    };

    var urlMap  = {
        'login': '/api/v1/auth/signin/',
        'signup': '/api/v1/auth/signup/',
        'logout': '/api/v1/auth/logout/'
    };

    return function(method, model, options) {
        var params = {type: methodMap[method]};
        var modelData = model.toJSON();

        params.dataType = 'json';
        params.contentType = 'application/json';
        params.processData = false;

        if (method === 'create') {
            params.url = urlMap['signup'];
            params.data = JSON.stringify(modelData);
        }

        if(method === 'read') {
            params.url = urlMap['login'];
            params.data = JSON.stringify(modelData);
        }

        if(method === 'delete') {
            params.url = urlMap['logout'];
        }

        return Backbone.ajax(_.extend(params, options));
    }


});