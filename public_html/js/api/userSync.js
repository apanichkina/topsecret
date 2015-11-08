define([
    'backbone'
], function(
    Backbone
) {

    var methodMap = {
        'create': 'POST'
    };

    var urlMap  = {
        'login': '/api/v1/auth/signin/',
        'signup': '/api/v1/auth/signup/'
    };

    return function(method, model, options) {
        var params = {type: methodMap[method]};
        var modelData = model.toJSON();

        if (method === 'create') {
            params.dataType = 'json';
            params.contentType = 'application/json';
            params.processData = false;

            if (!model.attributes.email) {
                params.url = urlMap['login'];
                params.data = JSON.stringify(modelData);
                params.success = function (data) {
                    if(data.code == 0) {
                        model.loginSuccess(data);
                    } else {
                        model.loginFailed(data);
                    }
                };
                params.error = function () {
                    alert("BAD SHIT");
                }
            } else {
                params.url = urlMap['signup'];
                params.data = JSON.stringify(modelData);
                params.success = function (data) {
                    if(data.code == 0) {
                        model.signupSuccess(data);
                    } else {
                        model.signupFailed(data);
                    }
                };
                params.error = function () {
                    alert("BAD SHIT");
                };
            }
        }

        return Backbone.ajax(params);
    }


});