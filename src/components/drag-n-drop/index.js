const Sortable = require("sortablejs").Sortable;

var ulavailablemetas = document.getElementById("availablemetas");
var ulmetas = document.getElementById("metas");

var ulavailablefilters = document.getElementById("availablefilters");
var ulfilters = document.getElementById("filters");

new Sortable(ulavailablemetas, {
    group: "metas",
    pull: "clone",
    animation: 150
});
new Sortable(ulmetas, {
    group: "metas",
    animation: 150
});

new Sortable(ulavailablefilters, {
    group: "filters",
    pull: "clone",
    animation: 150
});
new Sortable(ulfilters, {
    group: "filters",
    animation: 150
});
