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
        status: '/status/'
    };
    var storage = window.localStorage;
    return function(method, collection, options) {
        var params = {type: methodMap[method]};
        params.dataType = 'json';
        params.contentType = 'application/json';

        params.url = urlMap['status'];
        params.success = function (data) {
            collection.setScores(data);
        };

        params.error = function (data) {
            //if (data.status>= 500){
                collection.setFromLocalStorage();

        };

        return Backbone.ajax(params);

    }






});