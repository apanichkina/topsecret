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
        'logout': '/api/v1/auth/logout/',
        'profile': '/api/v1/auth/profile/'
    };

    return function(method, model, options) {
        var params = {type: methodMap[method]};

        params.dataType = 'json';
        params.contentType = 'application/json';
        params.processData = false;

        if (method === 'create') {
            params.url = urlMap['signup'];
            params.data = options.data;
        }

        if(method === 'read') {
            if(options.data){
                params.url = urlMap['login'];
                params.data = options.data;
            } else {
                params.url = urlMap['profile'];
                params.type = 'GET';
            }

        }

        if(method === 'delete') {
            params.url = urlMap['logout'];
        }

        return Backbone.ajax(_.extend(params, options));
    }


});