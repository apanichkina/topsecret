/**
 * Created by Alex on 04.10.15
 */
define([
    'backbone'
], function(
    Backbone
) {

    var methodMap = {
        'create': 'POST'
    };

    var urlMap  = {
        'login': '/api/v1/auth/signin',
        'signup': '/api/v1/auth/signup'
    };

    return function(method, model, options) {
        var params = {type: methodMap[method]};
        var modelData = model.toJSON();

        if (method === 'create') {
            params.dataType = 'json';
            params.contentType = 'application/json';
            params.processData = false;
            var success;

            if (model.email == "") {
                params.url = urlMap['login'];
                params.data = JSON.stringify(modelData);
                params.error = function () {
                    model.loginSuccess(modelData);
                };
            } else {
                params.url = urlMap['signup'];
                params.data = JSON.stringify(modelData);
                params.error = function () {
                    model.signupSuccess(modelData);
                };
            }
        }


        return Backbone.ajax(params);
    }


});