/**
 * Created by Alex on 21.09.15.
 */

require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        shoma: "lib/shoma"
    },
    shim: {
        //'backbone': {
        //    deps: ['underscore', 'jquery'],
        //    exports: 'Backbone'
        //},
        //'underscore': {
        //    exports: '_'
        //},
        'shoma': {
            deps: ['jquery'],
            exports: 'Shoma'
        }
    }
});

define([
    'backbone',
    'shoma',
    'router'
], function(
    Backbone,
    Shoma,
    router
){
    Backbone.history.start();


});