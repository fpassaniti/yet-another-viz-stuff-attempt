var Mustache = require("mustache");
var spinner = require('../../components/spinner');

const render = function () {
    spinner.on();

    var settings = {};

    settings["datasetid"] = app.datasetid;
    settings["view"] = document.getElementById("view").value;

    settings["filters"] = '';
    var tmpfilters = [];
    app.filters.forEach(function (filter) {
        if (!tmpfilters.includes(filter.id)) {
            tmpfilters.push(filter.id);
        }
    });
    if (tmpfilters.length > 0)
        settings["filters"] = "['" + tmpfilters.join("','") + "']";
    else
        settings["filters"] = '[]';

    settings["fields"] = '';
    var tmpfields = [];
    app.metas.forEach(function (meta) {
        if (!tmpfields.includes(meta.id)) {
            tmpfields.push(meta.id);
        }
    });
    settings["fields"] = '[\'' + tmpfields.join('\',\'') + '\']';

    $.get("templates/list-gen", function (templates) {
        var template = $(templates).html();
        var customTags = ["<%", "%>"];
        app.output = Mustache.render(template, settings, {}, customTags);

        var appelem = document.getElementById("app");
        appelem.innerHTML = ''; // cleanup before appending the new one

        var el = document.createElement("div");
        el.id = 'output';
        el.innerHTML = app.output;
        appelem.append(el);

        angular
            .element(appelem)
            .injector()
            .invoke(['$rootScope', '$compile', function ($rootScope, $compile) {
                return res = $compile(el)($rootScope);
            }]);

        angular.element(document).ready(function () {
            spinner.off();
        });
    });
};

module.exports = { render };
