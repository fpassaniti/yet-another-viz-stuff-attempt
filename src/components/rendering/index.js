const $ = require("jquery");

var Mustache = require("mustache");

const renderInit = function () {
    var settings = {};

    settings["datasetid"] = app.datasetid;
    settings["view"] = "cards"; //document.getElementById("view").value;

    settings["filters"] = '[]';
    settings["fields"] = '[]';

    var appelem = $('#app');
    appelem.html('');

    settings['title'] = app.title;

    Promise.all([
        fetch('templates/list-gen'),
        fetch('templates/list-gen-intro')
    ]).then(responses => {
        Promise.all(responses.map(response => { return response.text() })).then(htmls => {
            var customTags = ["<%", "%>"];
            var tmpoutput = Mustache.render(htmls[0], settings, {}, customTags);
            app.intro = Mustache.render(htmls[1], settings, {}, customTags);

            var tmpoutputel = $(tmpoutput);
            var intro = tmpoutputel.find('#intro');
            intro.html(app.intro);
            intro.find('#description').html(app.description);

            tmpoutputel.attr('id','output');
            appelem.append(tmpoutputel);

            angular
                .element(appelem)
                .injector()
                .invoke(['$rootScope', '$compile', function ($rootScope, $compile) {
                    console.log($rootScope.$root);
                    return $compile(tmpoutputel)($rootScope);
                }]);

            app.output = tmpoutputel.html();
        });
    });
};

const renderUpdate = function (key, value) {
    angular
        .element($('#app'))
        .injector()
        .invoke(['$rootScope', '$compile', function ($rootScope, $compile) {
            $rootScope.$apply(function () {
                $rootScope[key] = value;
            });
        }]);
}

module.exports = { renderInit, renderUpdate };
