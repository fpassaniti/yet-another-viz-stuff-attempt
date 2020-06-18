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
app.datasetid = '';

app.filters = [];
app.metas = [];
app.recordTitle = '';

app.output = '';

const dnd = require('./components/drag-n-drop');

const ac = require("./components/dataset-search");
ac.loadAC(dnd);

const rendering = require('./components/rendering');


$("#refresh").on("click", function() {
    rendering.render();
    dnd.loadDnDInTemplate();
});

require('./components/export');

/*
var dummy = require('./components/dummy');
dummy.dummy_sub_function();
dummy.dummy_assign();
*/


