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

    return function(method, collection, options) {
        alert('syncing');
        var params = {type: methodMap[method]};
        params.dataType = 'json';
        params.contentType = 'application/json';

        params.url = urlMap['status'];
        params.success = function (data) {
            collection.setScores(data);
        };

        params.error = function (data) {
            alert(data.code);
        };

        return Backbone.ajax(params);

    }






});