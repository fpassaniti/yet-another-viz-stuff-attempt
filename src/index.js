/**** STYLING ****/
import "./ods.css";
import "./style.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./components/drag-n-drop/style.scss";

/**** UTILS ****/
import $ from "jquery";

window.$ = $;
require('./utils');

/**** Global vars / setup / loading modules ****/
global.app = {};

const reset = () => {
    app.datasetid = '';

    app.filters = [];
    app.metas = [];
    app.sortable = {};

    app.recordTitle = '';

    app.output = '';
}

reset();

/***** Drag n Drop module *****/
const dnd = require('./components/drag-n-drop');

/***** Autocomplete *****/
const ac = require("./components/dataset-search");
ac.loadAC(dnd, reset);

/***** Rendering *****/
const rendering = require('./components/rendering');

$("#refresh").on("click", function () {
    rendering.renderUpdate('key', '');
    dnd.loadDnDInTemplate(rendering);
});

/***** Export module *****/
require('./components/export');

/*
var dummy = require('./components/dummy');
dummy.dummy_sub_function();
dummy.dummy_assign();
*/


$("#log").on("click", () => {
    console.log(app.sortable);
});

/*
var waitformetadrop = setInterval(() => {
    if ('metadrop' in app.sortable && $(app.sortable.metadrop.el).length) {
        clearInterval(waitformetadrop);

        setInterval(() => {
            console.log(app.sortable.metadrop.el == document.getElementById("#content-card-fields"));
        }, 1000);
    } else {
        console.log('wait for metadrop');
    }
}, 1000);*/
