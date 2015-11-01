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
        alert(method);
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
                params.success = function (data) {
                    console.log(data);
                    alert(data.response.description);
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
                params.success = function () {
                    model.signupSuccess(modelData);
                };

                params.error = function () {
                    alert("BAD SHIT");
                };
            }
        }


        return Backbone.ajax(params);
    }


});