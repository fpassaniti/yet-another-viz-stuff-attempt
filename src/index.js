/**** STYLING ****/
import "./ods.css";
import "./style.css";
import 'bootstrap/dist/css/bootstrap.min.css';

/**** UTILS ****/
import $ from "jquery";
window.$ = $;

/**** Global vars / setup / loading modules ****/
global.app = {};
app.datasetid = '';
app.output = '';

require('./components/dataset-search');
require('./components/drag-n-drop');
require('./components/rendering');
require('./components/export');

/*
var dummy = require('./components/dummy');
dummy.dummy_sub_function();
dummy.dummy_assign();
*/