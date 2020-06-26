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
    app.image = '';

    app.editinplace = {};

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
