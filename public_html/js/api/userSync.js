define([
    'backbone'
], function(
    Backbone
) {

    var methodMap = {
        'create': 'POST',
        'read': 'POST'
    };

    var urlMap  = {
        'login': '/api/v1/auth/signin/',
        'signup': '/api/v1/auth/signup/'
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
            params.success = function (data) {
                if(data.code == 0) {
                    model.signupSuccess(data);
                } else {
                    model.signupFailed(data);
                }
            };
            params.error = function (data) {
                model.signupFailed(data);
            };
        }

        if(method === 'read') {
            params.url = urlMap['login'];
            params.data = JSON.stringify(modelData);
            params.success = function (data) {
                if(data.code == 0) {
                    model.loginSuccess(data);
                } else {
                    model.loginFailed(data);
                }
            };
            params.error = function (data) {
                model.loginFailed(data);
            }
        }

        return Backbone.ajax(params);
    }


});