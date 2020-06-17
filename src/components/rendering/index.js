var Mustache = require("mustache");

$("#render").on("click", function() {
    var settings = {};

    settings["datasetid"] = app.datasetid;
    settings["view"] = document.getElementById("view").value;

    settings["filters"] = '';
    var tmpfilters = [];
    document.getElementById('filters').childNodes.forEach(function (child) {
        tmpfilters.push(child.id);
    });
    if (tmpfilters.length > 0)
        settings["filters"] = '[\'' + tmpfilters.join('\',\'') + '\']';
    else
        settings["filters"] = '\'\'';

    settings["fields"] = '';
    var tmpfields = [];
    document.getElementById('metas').childNodes.forEach(function (child) {
        tmpfields.push(child.id);
    });
    settings["fields"] = '[\'' + tmpfields.join('\',\'') + '\']';

    $.get("templates/list-gen", function(templates) {
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
            .invoke(['$rootScope', '$compile', function($rootScope, $compile) {
                var res = $compile(el)($rootScope);
            }]);
    });
});
