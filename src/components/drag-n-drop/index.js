const $ = require("jquery");

const Sortable = require("sortablejs").Sortable;

const loadDnD = function(rendering) {

    var ulavailablemetas = document.getElementById("availablemetas");

    var ulavailablefilters = document.getElementById("availablefilters");

    new Sortable(ulavailablemetas, {
        group: { name: "metas", pull: "clone", put: false},
        animation: 350,
        onStart: function (evt) {
            $("#content-card-fields").addClass("dnd__dropzone");
        },
        onEnd: function (evt) {
            let metaslist = $("#content-card-fields");
            if (metaslist[0] == evt.to) {
                console.debug('New meta drop !');
                app.metas.push(evt.item);

                rendering.render();
                loadDnDInTemplate();
            }

            $("#content-card-fields").removeClass("dnd__dropzone");
        }
    });

    new Sortable(ulavailablefilters, {
        group: { name: "filters", pull: "clone", put: false},
        pull: "clone",
        animation: 350,
        onStart: function (evt) {
            $("#filter-list").addClass("dnd__dropzone");
        },
        onEnd: function (evt) {
            let filterlist = $("#filter-list");
            if (filterlist[0] === evt.to) {
                console.debug('New filter drop!');
                app.filters.push(evt.item);

                rendering.render();
                loadDnDInTemplate();
            }

            filterlist.removeClass("dnd__dropzone");
        }
    });

    loadDnDInTemplate();
};

const loadDnDInTemplate = function() {
    console.debug('reload DnD in template');
    let checkExistFilters = setInterval(function () {
        if ($("#filter-list").length) {
            clearInterval(checkExistFilters);

            var ulfilterlistdrop = document.getElementById("filter-list");
            new Sortable(ulfilterlistdrop, {
                group: "filters",
                animation: 350,
                onEnd: function (evt) {
                    /* reordering */
                    if (evt.from == evt.to) {
                        app.filters.move(evt.oldIndex, evt.newIndex);
                    }
                }
            });
        }
    }, 100); // check every 100ms

    let checkExistMetas = setInterval(function () {
        if ($("#content-card-fields").length) {
            clearInterval(checkExistMetas);

            var ulfilterlistdrop = document.getElementById("content-card-fields");
            new Sortable(ulfilterlistdrop, {
                group: "metas",
                animation: 350,
                onEnd: function (evt) {
                    /* reordering */
                    if (evt.from == evt.to) {
                        app.metas.move(evt.oldIndex, evt.newIndex);
                    }
                }
            });
        }
    }, 100); // check every 100ms
};

module.exports = { loadDnD, loadDnDInTemplate };